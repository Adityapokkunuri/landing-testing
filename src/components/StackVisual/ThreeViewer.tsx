import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import { LAYER_SPECS } from './layerSpecs';
import { SWAP_PROFILES } from '../../content/swapConfigs';

export interface ThreeViewerProps {
  mode: 'assembled' | 'exploded' | 'swap' | 'scroll-exploded';
  activeLayer?: number | null; // 1 to 8 (1 = base chassis, 8 = top experience), or null for neutral
  progress?: number; // 0.0 (assembled) to 1.0 (exploded)
  hoverExplode?: boolean; // When true: hover on canvas triggers full mechanical expansion; unhover locks into assembled state
  onHoverChange?: (isHovered: boolean) => void;
  swapVersion?: 'A' | 'B';
  onLayerSelect?: (layerId: number) => void;
  onLayerHover?: (layerId: number | null) => void;
  className?: string;
  enableOrbit?: boolean;
  autoRotate?: boolean;
  transparent?: boolean;
  showHint?: boolean;
}

// ---------------------------------------------------------------------------
// Singleton GLTF Model Cache
// Avoids repeated network requests and eliminates hover reload glitches.
// ---------------------------------------------------------------------------
let cachedGLTFScene: THREE.Group | null = null;
let modelLoadPromise: Promise<THREE.Group> | null = null;

function cloneSceneWithMaterials(sourceScene: THREE.Group): THREE.Group {
  const cloned = sourceScene.clone(true);
  cloned.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      if (mesh.material) {
        if (Array.isArray(mesh.material)) {
          mesh.material = mesh.material.map((m) => {
            const clonedMat = m.clone();
            clonedMat.transparent = false;
            clonedMat.opacity = 1.0;
            return clonedMat;
          });
        } else {
          const clonedMat = (mesh.material as THREE.Material).clone();
          clonedMat.transparent = false;
          clonedMat.opacity = 1.0;
          mesh.material = clonedMat;
        }
      }
    }
  });
  return cloned;
}

function loadAssemblyModel(): Promise<THREE.Group> {
  if (cachedGLTFScene) {
    return Promise.resolve(cloneSceneWithMaterials(cachedGLTFScene));
  }
  if (!modelLoadPromise) {
    modelLoadPromise = new Promise((resolve, reject) => {
      const loader = new GLTFLoader();
      loader.load(
        '/models/foundation/shared-foundation-assembly.glb',
        (gltf) => {
          cachedGLTFScene = gltf.scene;
          resolve(cloneSceneWithMaterials(gltf.scene));
        },
        undefined,
        (err) => {
          modelLoadPromise = null;
          reject(err);
        }
      );
    });
  }
  return modelLoadPromise.then((scene) => cloneSceneWithMaterials(scene));
}

// ---------------------------------------------------------------------------
// Calibrated Camera Keyframes for Scroll-Driven Explorer (Mode: scroll-exploded)
// ---------------------------------------------------------------------------
// Calibrated Camera Keyframes for Scroll-Driven Explorer (Mode: scroll-exploded)
// Unpacks monolith at center (0.00-0.15) to framing full exploded stack on left (0.75-1.00)
// ---------------------------------------------------------------------------
interface CameraKeyframe {
  p: number;
  cam: [number, number, number];
  target: [number, number, number];
  layerId: number | null;
}

const SCROLL_CAMERA_KEYFRAMES: CameraKeyframe[] = [
  // 1. Initial Assembled Overview: Locked monolith "YOUR CORE PRODUCT" dead center
  { p: 0.00, cam: [0.38, 0.32, 0.44], target: [0.00, 0.05, 0.00], layerId: null },
  { p: 0.15, cam: [0.38, 0.32, 0.44], target: [0.00, 0.05, 0.00], layerId: null },

  // 2. Exploded Stack Overview on Left: Entire 8-plate assembly visible in left half
  { p: 0.80, cam: [0.34, 0.36, 0.54], target: [0.00, 0.14, 0.00], layerId: null },
  { p: 1.00, cam: [0.34, 0.36, 0.54], target: [0.00, 0.14, 0.00], layerId: null },
];

function interpolateCamera(p: number): {
  cam: [number, number, number];
  target: [number, number, number];
  activeLayerId: number | null;
} {
  const clamped = Math.min(Math.max(p, 0), 1);
  for (let i = 0; i < SCROLL_CAMERA_KEYFRAMES.length - 1; i++) {
    const k0 = SCROLL_CAMERA_KEYFRAMES[i];
    const k1 = SCROLL_CAMERA_KEYFRAMES[i + 1];
    if (clamped >= k0.p && clamped <= k1.p) {
      const span = k1.p - k0.p;
      const t = span === 0 ? 0 : (clamped - k0.p) / span;
      // Smooth mechanical ease
      const easeT = t * t * (3 - 2 * t);
      const cam: [number, number, number] = [
        k0.cam[0] + (k1.cam[0] - k0.cam[0]) * easeT,
        k0.cam[1] + (k1.cam[1] - k0.cam[1]) * easeT,
        k0.cam[2] + (k1.cam[2] - k0.cam[2]) * easeT,
      ];
      const target: [number, number, number] = [
        k0.target[0] + (k1.target[0] - k0.target[0]) * easeT,
        k0.target[1] + (k1.target[1] - k0.target[1]) * easeT,
        k0.target[2] + (k1.target[2] - k0.target[2]) * easeT,
      ];
      const activeLayerId = t < 0.5 ? k0.layerId : k1.layerId;
      return { cam, target, activeLayerId };
    }
  }
  const last = SCROLL_CAMERA_KEYFRAMES[SCROLL_CAMERA_KEYFRAMES.length - 1];
  return { cam: last.cam, target: last.target, activeLayerId: last.layerId };
}

export const ThreeViewer: React.FC<ThreeViewerProps> = ({
  mode,
  activeLayer = null as unknown as number,
  progress = 0,
  hoverExplode = false,
  onHoverChange,
  swapVersion = 'A',
  onLayerSelect,
  onLayerHover,
  className = '',
  enableOrbit = true,
  autoRotate = false,
  transparent = true,
  showHint = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Interaction callback refs to prevent any canvas teardown on parent re-renders
  const onHoverChangeRef = useRef(onHoverChange);
  onHoverChangeRef.current = onHoverChange;
  const onLayerSelectRef = useRef(onLayerSelect);
  onLayerSelectRef.current = onLayerSelect;
  const onLayerHoverRef = useRef(onLayerHover);
  onLayerHoverRef.current = onLayerHover;

  // Active layer and progress refs for render loop access
  const activeLayerRef = useRef(activeLayer);
  activeLayerRef.current = activeLayer;
  const progressAnimRef = useRef<{ value: number }>({ value: progress });

  // References to Three.js scene instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const layerNodesRef = useRef<Map<number, THREE.Object3D>>(new Map());
  const interactiveLightRef = useRef<THREE.PointLight | null>(null);
  const reticleRef = useRef<THREE.Mesh | null>(null);
  const monolithCasingRef = useRef<{
    group: THREE.Group;
    topShell: THREE.Group;
    bottomShell: THREE.Group;
    mat: THREE.MeshStandardMaterial;
    seamMat: THREE.MeshBasicMaterial;
    badgeMat?: THREE.MeshStandardMaterial;
  } | null>(null);
  const masterAssemblyRef = useRef<THREE.Group | null>(null);
  const reqIdRef = useRef<number | null>(null);
  const isDraggingRef = useRef<boolean>(false);

  // Update animated layer positions along the vertical Y axis
  const updateStackPositions = (currentProgress: number, targetActiveLayer: number | null) => {
    if (!layerNodesRef.current || layerNodesRef.current.size === 0) return;

    // In scroll-exploded mode, master assembly stays centered until progress > 0.10, then smoothly glides left (-0.17m)
    if (masterAssemblyRef.current && mode === 'scroll-exploded') {
      const lateralT = Math.min(Math.max((currentProgress - 0.10) / 0.65, 0), 1);
      gsap.to(masterAssemblyRef.current.position, {
        x: -lateralT * 0.17,
        duration: 0.5,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }

    const gapAssembled = 0.0005;
    const gapExploded = 0.038;
    const gapSwap = 0.020; // 20 mm separation for well-proportioned, airy whole assembly display

    // In scroll-exploded mode, assembly expands along Y from progress 0.15 to 0.75
    const expansionT = mode === 'scroll-exploded'
      ? Math.min(Math.max((currentProgress - 0.15) / 0.60, 0), 1)
      : Math.min(Math.max(currentProgress, 0), 1);

    const currentGap = mode === 'swap'
      ? gapSwap
      : gapAssembled + (gapExploded - gapAssembled) * expansionT;
    let cumulativeY = 0;

    LAYER_SPECS.forEach((spec) => {
      const node = layerNodesRef.current.get(spec.id);
      if (!node) return;

      node.visible = true;
      const targetY = cumulativeY;
      cumulativeY += spec.thickness + currentGap;

      // Animate node Y position smoothly along true vertical stacking axis
      gsap.to(node.position, {
        y: targetY - spec.baseY,
        duration: 0.45,
        ease: 'power3.out',
        overwrite: 'auto',
      });

      // Active layer highlight
      const isActive = targetActiveLayer !== null && spec.id === targetActiveLayer;

      node.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (mesh.isMesh && mesh.material) {
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((mat) => {
            if (mat instanceof THREE.MeshStandardMaterial) {
              // Ensure all components are completely solid/opaque (never transparent)
              mat.transparent = false;
              mat.opacity = 1.0;

              if (isActive) {
                gsap.to(mat, {
                  roughness: 0.16,
                  emissiveIntensity: 0.38,
                  duration: 0.35,
                  overwrite: 'auto',
                });
                mat.emissive.set('#FF5500');
              } else {
                gsap.to(mat, {
                  roughness: 0.28,
                  emissiveIntensity: 0.0,
                  duration: 0.35,
                  overwrite: 'auto',
                });
              }
            }
          });
        }
      });
    });

    // Dynamically adjust orbit controls target Y in standard exploded / hover modes
    if (controlsRef.current && (mode === 'exploded' || hoverExplode)) {
      const midY = cumulativeY / 2;
      gsap.to(controlsRef.current.target, {
        y: midY,
        duration: 0.45,
        ease: 'power3.out',
        overwrite: 'auto',
      });
    }

    // Enterprise Monolith Enclosure (Concept 2): Opens & dissolves as user scrolls below header
    if (monolithCasingRef.current && (mode === 'scroll-exploded' || mode === 'assembled')) {
      const { group, topShell, bottomShell, mat, seamMat, badgeMat } = monolithCasingRef.current;
      const revealProgress = Math.min(Math.max((currentProgress - 0.06) / 0.30, 0), 1);

      if (revealProgress >= 0.98) {
        group.visible = false;
      } else {
        group.visible = true;
        // Upper shell lifts upward smoothly
        topShell.position.y = revealProgress * 0.28;
        // Lower shell descends downward smoothly
        bottomShell.position.y = -revealProgress * 0.18;
        // Outer casing fades out to transparent
        const currentOpacity = Math.max(1.0 - revealProgress * 1.35, 0.0);
        mat.opacity = currentOpacity;
        seamMat.opacity = Math.max(1.0 - revealProgress * 1.5, 0.0);
        if (badgeMat) badgeMat.opacity = currentOpacity;
      }
    }
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene Setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    if (!transparent) {
      scene.background = new THREE.Color('#FAF9F5');
    } else {
      scene.background = null;
    }

    // Master Assembly Group (holds monolith casing, loaded GLB model, and contact shadow)
    const masterAssembly = new THREE.Group();
    masterAssembly.name = 'Master_Assembly_Group';
    scene.add(masterAssembly);
    masterAssemblyRef.current = masterAssembly;

    // 2. Camera Setup - 3/4 Isometric Perspective
    const aspect = container.clientWidth / (container.clientHeight || 1);
    const camera = new THREE.PerspectiveCamera(36, aspect, 0.05, 20);
    cameraRef.current = camera;
    camera.up.set(0, 1, 0); // +Y is explicitly UP

    if (mode === 'swap') {
      // Spacious, un-congested camera distance framing the entire 8-layer assembly
      camera.position.set(0.66, 0.44, 0.70);
    } else if (mode === 'exploded') {
      camera.position.set(0.44, 0.48, 0.52);
    } else if (mode === 'scroll-exploded') {
      const initial = interpolateCamera(progressAnimRef.current.value);
      camera.position.set(...initial.cam);
    } else {
      camera.position.set(0.38, 0.36, 0.44);
    }

    // 3. High-Performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    rendererRef.current = renderer;
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFShadowMap;

    renderer.domElement.style.touchAction = 'pan-y';
    container.appendChild(renderer.domElement);

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    // Disable zoom so mouse wheel and trackpad scroll always scroll the webpage smoothly from anywhere
    controls.enableZoom = false;
    controls.minDistance = 0.22;
    controls.maxDistance = 1.9;
    controls.enabled = enableOrbit;
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.7;
    controls.maxPolarAngle = Math.PI / 2 + 0.02;

    const initialTargetY = mode === 'swap' ? 0.12 : mode === 'exploded' ? 0.14 : 0.054;
    controls.target.set(0, initialTargetY, 0);
    controls.update();

    controls.addEventListener('start', () => { isDraggingRef.current = true; });
    controls.addEventListener('end', () => { isDraggingRef.current = false; });

    // 5. Architectural Studio Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.88);
    scene.add(ambientLight);

    // Warm Sun Key Light casting crisp contact shadows downward
    const keyLight = new THREE.DirectionalLight(0xfff8f0, 2.2);
    keyLight.position.set(0.8, 1.8, 1.2);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 1024;
    keyLight.shadow.mapSize.height = 1024;
    keyLight.shadow.camera.near = 0.1;
    keyLight.shadow.camera.far = 4;
    keyLight.shadow.bias = -0.0005;
    scene.add(keyLight);

    // Cool Titanium Fill Light
    const fillLight = new THREE.DirectionalLight(0xdbe3ea, 1.1);
    fillLight.position.set(-1.0, 0.9, -0.6);
    scene.add(fillLight);

    // Vivid Leica Orange Rim Light
    const orangeRim = new THREE.PointLight(0xFF5500, 2.2, 2.5);
    orangeRim.position.set(-0.4, 0.5, 0.35);
    scene.add(orangeRim);

    // Dynamic Micro-Animation & Datum Point Light
    const interactiveLight = new THREE.PointLight(0xFF5500, 0, 0.6);
    interactiveLightRef.current = interactiveLight;
    scene.add(interactiveLight);

    // Interactive 3D Datum Reticle Beacon Ring
    const reticleGeo = new THREE.RingGeometry(0.007, 0.010, 32);
    const reticleMat = new THREE.MeshBasicMaterial({
      color: 0xFF5500,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0,
    });
    const reticleMesh = new THREE.Mesh(reticleGeo, reticleMat);
    reticleMesh.rotation.x = -Math.PI / 2;
    reticleMesh.visible = false;
    reticleRef.current = reticleMesh;
    scene.add(reticleMesh);

    // Top Specular Rim Light
    const rimLight = new THREE.DirectionalLight(0xffffff, 1.2);
    rimLight.position.set(0.2, 1.5, 0.8);
    scene.add(rimLight);

    // Subtle Ground Contact Shadow Plane
    const shadowGeo = new THREE.PlaneGeometry(1.6, 1.6);
    const shadowMat = new THREE.ShadowMaterial({ opacity: 0.12 });
    const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.set(0, -0.001, 0);
    shadowPlane.receiveShadow = true;
    masterAssembly.add(shadowPlane);

    // 5.5 Enterprise Monolith Enclosure (Concept 2: Sealed Enterprise Monolith that opens on scroll)
    if (mode === 'scroll-exploded' || mode === 'assembled') {
      const monolithGroup = new THREE.Group();
      monolithGroup.name = 'Enterprise_Monolith_Enclosure';
      masterAssembly.add(monolithGroup);

      const casingMat = new THREE.MeshStandardMaterial({
        color: 0x14161c,
        roughness: 0.28,
        metalness: 0.65,
        transparent: true,
        opacity: 1.0,
        side: THREE.DoubleSide,
      });

      const seamMat = new THREE.MeshBasicMaterial({
        color: 0xff5500,
        transparent: true,
        opacity: 1.0,
      });

      // Top Monolith Shell (caps upper plates, sits from Y=0.048 to Y=0.106)
      const topShell = new THREE.Group();
      topShell.name = 'Top_Monolith_Shell';
      monolithGroup.add(topShell);

      const topCap = new THREE.Mesh(new THREE.BoxGeometry(0.324, 0.008, 0.224), casingMat);
      topCap.position.set(0, 0.102, 0);
      topCap.castShadow = true;
      topShell.add(topCap);

      const topFront = new THREE.Mesh(new THREE.BoxGeometry(0.324, 0.052, 0.008), casingMat);
      topFront.position.set(0, 0.074, 0.108);
      topFront.castShadow = true;
      topShell.add(topFront);

      const topBack = new THREE.Mesh(new THREE.BoxGeometry(0.324, 0.052, 0.008), casingMat);
      topBack.position.set(0, 0.074, -0.108);
      topShell.add(topBack);

      const topLeft = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.052, 0.208), casingMat);
      topLeft.position.set(-0.158, 0.074, 0);
      topShell.add(topLeft);

      const topRight = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.052, 0.208), casingMat);
      topRight.position.set(0.158, 0.074, 0);
      topShell.add(topRight);

      // Front Enterprise Monolith Badge Plate: "YOUR CORE PRODUCT"
      const badgeCanvas = document.createElement('canvas');
      badgeCanvas.width = 512;
      badgeCanvas.height = 128;
      const bCtx = badgeCanvas.getContext('2d');
      if (bCtx) {
        bCtx.fillStyle = '#1A1D24';
        bCtx.fillRect(0, 0, 512, 128);
        bCtx.strokeStyle = '#383D4A';
        bCtx.lineWidth = 4;
        bCtx.strokeRect(4, 4, 504, 120);

        // Accent indicator dot
        bCtx.fillStyle = '#FF5500';
        bCtx.beginPath();
        bCtx.arc(42, 64, 10, 0, Math.PI * 2);
        bCtx.fill();

        // Title text
        bCtx.fillStyle = '#FFFFFF';
        bCtx.font = 'bold 36px "JetBrains Mono", monospace';
        bCtx.fillText('YOUR CORE PRODUCT', 72, 54);

        // Subtitle
        bCtx.fillStyle = '#94A3B8';
        bCtx.font = '22px "JetBrains Mono", monospace';
        bCtx.fillText('ENTERPRISE UNIFIED SYSTEM', 72, 94);
      }
      const badgeTexture = new THREE.CanvasTexture(badgeCanvas);
      badgeTexture.anisotropy = 4;

      const badgeMat = new THREE.MeshStandardMaterial({
        map: badgeTexture,
        roughness: 0.35,
        metalness: 0.5,
        transparent: true,
        opacity: 1.0,
      });

      const badge = new THREE.Mesh(new THREE.BoxGeometry(0.180, 0.045, 0.003), badgeMat);
      badge.position.set(0, 0.076, 0.113);
      topShell.add(badge);

      // Glowing Horizon Laser Seam along split line
      const seamFront = new THREE.Mesh(new THREE.BoxGeometry(0.312, 0.003, 0.004), seamMat);
      seamFront.position.set(0, 0.048, 0.112);
      topShell.add(seamFront);

      // Bottom Monolith Shell (caps lower plates, sits from Y=-0.006 to Y=0.048)
      const bottomShell = new THREE.Group();
      bottomShell.name = 'Bottom_Monolith_Shell';
      monolithGroup.add(bottomShell);

      const bottomCap = new THREE.Mesh(new THREE.BoxGeometry(0.324, 0.008, 0.224), casingMat);
      bottomCap.position.set(0, -0.006, 0);
      bottomCap.receiveShadow = true;
      bottomShell.add(bottomCap);

      const botFront = new THREE.Mesh(new THREE.BoxGeometry(0.324, 0.048, 0.008), casingMat);
      botFront.position.set(0, 0.022, 0.108);
      bottomShell.add(botFront);

      const botBack = new THREE.Mesh(new THREE.BoxGeometry(0.324, 0.048, 0.008), casingMat);
      botBack.position.set(0, 0.022, -0.108);
      bottomShell.add(botBack);

      const botLeft = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.048, 0.208), casingMat);
      botLeft.position.set(-0.158, 0.022, 0);
      bottomShell.add(botLeft);

      const botRight = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.048, 0.208), casingMat);
      botRight.position.set(0.158, 0.022, 0);
      bottomShell.add(botRight);

      monolithCasingRef.current = {
        group: monolithGroup,
        topShell,
        bottomShell,
        mat: casingMat,
        seamMat,
        badgeMat,
      };
    }

    // 6. Load / Clone Model from Singleton Cache
    setLoading(true);
    setHasError(false);

    loadAssemblyModel()
      .then((root) => {
        masterAssembly.add(root);
        layerNodesRef.current.clear();

        // Map the 8 layer nodes
        for (const spec of LAYER_SPECS) {
          let matched: THREE.Object3D | null = null;
          root.traverse((node) => {
            if (node.name.includes(spec.name)) {
              if (!matched || node.parent === root) {
                matched = node;
              }
            }
          });
          if (matched) {
            layerNodesRef.current.set(spec.id, matched);
          }
        }

        // Fallback: sort root children by Y position if needed
        if (layerNodesRef.current.size < 8 && root.children.length >= 8) {
          const sorted = [...root.children].sort((a, b) => a.position.y - b.position.y);
          sorted.forEach((child, idx) => {
            if (idx < 8) layerNodesRef.current.set(idx + 1, child);
          });
        }

        setLoading(false);

        // Apply initial layout
        const initialProgress = mode === 'exploded' ? 1.0 : progressAnimRef.current.value;
        updateStackPositions(initialProgress, activeLayerRef.current);

        // Swap mode: ensure all plates in assembly are visible
        if (mode === 'swap') {
          layerNodesRef.current.forEach((node) => {
            node.visible = true;
          });
          updateStackPositions(0.0, activeLayerRef.current);
        }
      })
      .catch((err) => {
        console.error('Failed to load foundation 3D assembly GLB:', err);
        setHasError(true);
        setLoading(false);
      });

    // 7. Raycasting for interactive clicks & layer hover
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const getIntersectedLayerId = (clientX: number, clientY: number): number | null => {
      if (!sceneRef.current || !cameraRef.current || !rendererRef.current) return null;
      const rect = rendererRef.current.domElement.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, cameraRef.current);
      const meshes: THREE.Mesh[] = [];
      sceneRef.current.traverse((child) => {
        if ((child as THREE.Mesh).isMesh) meshes.push(child as THREE.Mesh);
      });
      const intersects = raycaster.intersectObjects(meshes, true);

      if (intersects.length > 0) {
        const hit = intersects[0].object;
        for (const [id, node] of layerNodesRef.current.entries()) {
          let hitBelongs = false;
          node.traverse((descendant) => {
            if (descendant === hit) hitBelongs = true;
          });
          if (hitBelongs) return id;
        }
      }
      return null;
    };

    let pointerDownPos = { x: 0, y: 0 };

    const handlePointerDown = (event: PointerEvent) => {
      pointerDownPos = { x: event.clientX, y: event.clientY };
    };

    const handlePointerUp = (event: PointerEvent) => {
      const dist = Math.hypot(event.clientX - pointerDownPos.x, event.clientY - pointerDownPos.y);
      // Only treat as a click if the mouse didn't drag/orbit (movement <= 6px)
      if (dist <= 6) {
        const layerId = getIntersectedLayerId(event.clientX, event.clientY);
        if (layerId && onLayerSelectRef.current) {
          onLayerSelectRef.current(layerId);
        } else if (hoverExplode && mode === 'assembled') {
          const willExpand = progressAnimRef.current.value < 0.5;
          setIsHovered(willExpand);
          if (onHoverChangeRef.current) {
            onHoverChangeRef.current(willExpand);
          }
          gsap.to(progressAnimRef.current, {
            value: willExpand ? 1.0 : 0.0,
            duration: 0.75,
            ease: willExpand ? 'power3.out' : 'power2.inOut',
            onUpdate: () => {
              updateStackPositions(progressAnimRef.current.value, activeLayerRef.current);
            },
          });
        }
      }
    };

    const handlePointerMove = (event: MouseEvent) => {
      const layerId = getIntersectedLayerId(event.clientX, event.clientY);
      if (onLayerHoverRef.current) {
        onLayerHoverRef.current(layerId);
      }
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
      if (onHoverChangeRef.current) {
        onHoverChangeRef.current(true);
      }
      if (hoverExplode && mode === 'assembled') {
        gsap.to(progressAnimRef.current, {
          value: 1.0,
          duration: 0.85,
          ease: 'power3.out',
          onUpdate: () => {
            updateStackPositions(progressAnimRef.current.value, activeLayerRef.current);
          },
        });
      }
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      if (onHoverChangeRef.current) {
        onHoverChangeRef.current(false);
      }
      if (onLayerHoverRef.current) {
        onLayerHoverRef.current(null);
      }
      if (hoverExplode && mode === 'assembled') {
        gsap.to(progressAnimRef.current, {
          value: 0.0,
          duration: 0.65,
          ease: 'power2.inOut',
          onUpdate: () => {
            updateStackPositions(progressAnimRef.current.value, activeLayerRef.current);
          },
        });
      }
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('pointerdown', handlePointerDown);
    domElement.addEventListener('pointerup', handlePointerUp);
    domElement.addEventListener('mousemove', handlePointerMove);
    domElement.addEventListener('mouseenter', handleMouseEnter);
    domElement.addEventListener('mouseleave', handleMouseLeave);

    // 8. Animation Loop with 8-Layer Micro-Animations & Camera Interpolation
    const animate = () => {
      reqIdRef.current = requestAnimationFrame(animate);
      const elapsed = performance.now() * 0.001;

      // Camera flight interpolation in scroll-exploded mode
      if (mode === 'scroll-exploded') {
        const { cam: targetCam, target: targetLookAt } = interpolateCamera(progressAnimRef.current.value);
        if (!isDraggingRef.current) {
          camera.position.lerp(new THREE.Vector3(...targetCam), 0.08);
          controls.target.lerp(new THREE.Vector3(...targetLookAt), 0.08);
        }
      }

      controls.update();

      // Idle subtle breathing in assembled mode
      if (mode === 'assembled' && !isDraggingRef.current && !hoverExplode) {
        scene.position.y = Math.sin(elapsed * 1.2) * 0.002;
      }

      // Specialized 8-Layer Micro-Animations
      const curLayer = activeLayerRef.current;
      const spec = curLayer ? LAYER_SPECS.find((s) => s.id === curLayer) : undefined;

      if (curLayer && spec && interactiveLightRef.current && reticleRef.current) {
        const node = layerNodesRef.current.get(curLayer);
        const nodeYOffset = node ? node.position.y : 0;
        const [dx, dy, dz] = spec.datumCoord;
        const actualDatumY = dy + nodeYOffset;

        // Micro-animations keyed by layer spec animType
        switch (spec.animType) {
          case 'torque': {
            // Plate 01: Torque flash & datum pulse
            const flash = Math.sin(elapsed * 6) > 0.3 ? 2.8 : 0.4;
            interactiveLightRef.current.color.set('#FF5500');
            interactiveLightRef.current.intensity = flash;
            interactiveLightRef.current.position.set(dx, actualDatumY + 0.015, dz);
            break;
          }
          case 'packets': {
            // Plate 02: Bus packet streaming along longitudinal channels
            const packetZ = dz - Math.sin(elapsed * 4.5) * 0.055;
            interactiveLightRef.current.color.set('#38BDF8');
            interactiveLightRef.current.intensity = 2.4;
            interactiveLightRef.current.position.set(dx, actualDatumY + 0.012, packetZ);
            break;
          }
          case 'perimeter-sweep': {
            // Plate 03: Laser perimeter sweep around central void
            const angle = elapsed * 3.2;
            const sweepX = Math.cos(angle) * 0.105;
            const sweepZ = Math.sin(angle) * 0.062;
            interactiveLightRef.current.color.set('#FF5500');
            interactiveLightRef.current.intensity = 2.2;
            interactiveLightRef.current.position.set(sweepX, actualDatumY + 0.015, sweepZ);
            break;
          }
          case 'neural-heatsink': {
            // Plate 04: Respiration pulse on neural honeycomb compute die
            const breath = 1.6 + Math.sin(elapsed * 3.0) * 1.2;
            interactiveLightRef.current.color.set('#FF5500');
            interactiveLightRef.current.intensity = breath;
            interactiveLightRef.current.position.set(dx, actualDatumY + 0.02, dz);

            // Modulate die emissive material
            if (node) {
              node.traverse((c) => {
                const m = c as THREE.Mesh;
                if (m.isMesh && m.material instanceof THREE.MeshStandardMaterial) {
                  m.material.emissiveIntensity = 0.25 + (breath / 2.8) * 0.35;
                }
              });
            }
            break;
          }
          case 'policy-gates': {
            // Plate 05: Branching policy gate alternation
            const phase = (Math.sin(elapsed * 5.0) + 1.0) * 0.5;
            interactiveLightRef.current.color.set('#F59E0B');
            interactiveLightRef.current.intensity = 1.0 + phase * 1.8;
            interactiveLightRef.current.position.set(dx + (phase - 0.5) * 0.04, actualDatumY + 0.015, dz);
            break;
          }
          case 'optical-couplers': {
            // Plate 06: Circular ring sequence across 6 coupler sockets
            const ringAngle = elapsed * 4.0;
            const rx = 0.060 * Math.cos(ringAngle);
            const rz = -0.095 + 0.02 * Math.sin(ringAngle);
            interactiveLightRef.current.color.set('#10B981');
            interactiveLightRef.current.intensity = 2.6;
            interactiveLightRef.current.position.set(rx, actualDatumY + 0.015, rz);
            break;
          }
          case 'cartridge-dock': {
            // Plate 07: Modular cartridge slide dock excursion along guide rails
            interactiveLightRef.current.color.set('#FF5500');
            interactiveLightRef.current.intensity = 2.0;
            interactiveLightRef.current.position.set(dx, actualDatumY + 0.018, dz);

            if (node) {
              node.children.forEach((child, idx) => {
                if (child.name.toLowerCase().includes('cartridge') || idx > 1) {
                  child.position.z = Math.sin(elapsed * 2.5 + idx) * 0.0022;
                }
              });
            }
            break;
          }
          case 'glass-scanline': {
            // Plate 08: Edge-to-edge optical glass scanline sweep
            const scanZ = Math.sin(elapsed * 2.5) * 0.075;
            interactiveLightRef.current.color.set('#FFFFFF');
            interactiveLightRef.current.intensity = 2.4;
            interactiveLightRef.current.position.set(dx, actualDatumY + 0.012, scanZ);
            break;
          }
        }

        // Position and pulse the 3D datum reticle
        reticleRef.current.visible = mode === 'scroll-exploded' || mode === 'exploded';
        reticleRef.current.position.set(dx, actualDatumY + 0.002, dz);
        const reticleScale = 1.0 + Math.sin(elapsed * 4.0) * 0.15;
        reticleRef.current.scale.set(reticleScale, reticleScale, reticleScale);
        (reticleRef.current.material as THREE.MeshBasicMaterial).opacity = 0.85;
      } else if (interactiveLightRef.current && reticleRef.current) {
        interactiveLightRef.current.intensity = 0;
        reticleRef.current.visible = false;
      }

      renderer.render(scene, camera);
    };

    animate();

    // 9. Resize Observer
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 1;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    return () => {
      if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
      resizeObserver.disconnect();
      domElement.removeEventListener('pointerdown', handlePointerDown);
      domElement.removeEventListener('pointerup', handlePointerUp);
      domElement.removeEventListener('mousemove', handlePointerMove);
      domElement.removeEventListener('mouseenter', handleMouseEnter);
      domElement.removeEventListener('mouseleave', handleMouseLeave);
      if (container.contains(domElement)) {
        container.removeChild(domElement);
      }
      if (monolithCasingRef.current) {
        monolithCasingRef.current.mat.dispose();
        monolithCasingRef.current.seamMat.dispose();
        if (monolithCasingRef.current.badgeMat) {
          monolithCasingRef.current.badgeMat.map?.dispose();
          monolithCasingRef.current.badgeMat.dispose();
        }
        monolithCasingRef.current = null;
      }
      renderer.dispose();
    };
  }, [mode, enableOrbit, autoRotate, hoverExplode, transparent]);

  // Handle Dynamic Separation (Progress) and Active Layer Highlighting
  useEffect(() => {
    if (loading || hasError) return;

    if (hoverExplode && mode === 'assembled') {
      updateStackPositions(progressAnimRef.current.value, activeLayer);
      return;
    }

    const targetProgress = mode === 'exploded' ? 1.0 : progress;
    progressAnimRef.current.value = targetProgress;

    // In scroll-exploded mode, resolvedActiveLayer is strictly what the user selected/hovered (or null)
    const resolvedActiveLayer: number | null = activeLayer ?? null;

    updateStackPositions(targetProgress, resolvedActiveLayer);
  }, [progress, activeLayer, mode, loading, hasError, hoverExplode, isHovered]);

  // Handle Swap Mode Highlight & Assembly Calibration whenever activeLayer changes
  useEffect(() => {
    if (mode !== 'swap' || loading) return;

    // Ensure all 8 plates are visible in the whole assembly and docked
    layerNodesRef.current.forEach((node) => {
      node.visible = true;
      gsap.killTweensOf(node.position);
      node.position.x = 0.0;
    });

    updateStackPositions(0.0, activeLayer);

    if (controlsRef.current) {
      gsap.to(controlsRef.current.target, {
        y: 0.12,
        duration: 0.4,
        ease: 'power2.out',
      });
    }
  }, [activeLayer, mode, loading]);

  // Handle Physical Ejection & Re-Docking for ANY activeLayer (1 to 8):
  // Current plate exits in one direction (+X), new replacement plate enters from opposite direction (-X) and docks
  useEffect(() => {
    if (mode !== 'swap' || loading || !activeLayer) return;

    const targetLayerNode = layerNodesRef.current.get(activeLayer);
    if (!targetLayerNode) return;

    const profile = SWAP_PROFILES[activeLayer] || SWAP_PROFILES[4];
    const isVersionB = swapVersion === 'B';
    const activeOption = isVersionB ? profile.versionB : profile.versionA;

    const applySwapMaterials = () => {
      targetLayerNode.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (mesh.isMesh && mesh.material) {
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          mats.forEach((mat) => {
            if (mat instanceof THREE.MeshStandardMaterial) {
              mat.color.set(activeOption.color);
              mat.emissive.set(activeOption.emissive);
              mat.emissiveIntensity = isVersionB ? 0.38 : 0.25;
              mat.roughness = isVersionB ? 0.18 : 0.24;
              mat.metalness = 0.75;
              mat.transparent = false;
              mat.opacity = 1.0;
            }
          });
        }
      });
    };

    // Kill any active tween on target plate
    gsap.killTweensOf(targetLayerNode.position);

    const exitDistance = 0.42; // Exits to the right (+X)
    const enterDistance = -0.42; // Replacement enters from the left (-X)

    // Phase 1: Slide current plate completely out to the right (+X)
    gsap.to(targetLayerNode.position, {
      x: exitDistance,
      duration: 0.32,
      ease: 'power2.in',
      onComplete: () => {
        // Phase 2: Apply new version materials while plate is outside the chassis
        applySwapMaterials();

        // Teleport to the opposite side (-X)
        targetLayerNode.position.x = enterDistance;

        // Phase 3: Slide the brand-new plate in from the opposite direction into the slot
        gsap.to(targetLayerNode.position, {
          x: 0.0,
          duration: 0.44,
          ease: 'power3.out',
          onComplete: () => {
            // Phase 4: Mechanical latch lock flash confirmation
            if (interactiveLightRef.current) {
              const spec = LAYER_SPECS.find((s) => s.id === activeLayer);
              if (spec) {
                const [dx, dy, dz] = spec.datumCoord;
                const nodeYOffset = targetLayerNode.position.y;
                interactiveLightRef.current.position.set(dx, dy + nodeYOffset + 0.015, dz);
                interactiveLightRef.current.color.set(isVersionB ? '#38BDF8' : '#FF5500');
                gsap.fromTo(
                  interactiveLightRef.current,
                  { intensity: 3.2 },
                  { intensity: 0, duration: 0.35, ease: 'power2.out' }
                );
              }
            }
          },
        });
      },
    });
  }, [swapVersion, activeLayer, mode, loading]);

  if (hasError) {
    return (
      <div className={`relative w-full h-full flex items-center justify-center bg-card rounded-2xl border border-border overflow-hidden ${className}`}>
        <img
          src={mode === 'exploded' ? '/renders/exploded-preview.png' : '/renders/assembly-preview.png'}
          alt="Shared Foundation Architecture Stack"
          className="w-full h-full object-contain p-6 select-none pointer-events-none"
        />
        <div className="absolute bottom-3 right-3 text-[10px] font-mono bg-card/90 backdrop-blur px-2.5 py-1 rounded border border-border text-secondary shadow-subtle">
          2D Precision Fallback Active
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full select-none ${className}`}>
      {/* 3D WebGL Mount */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Loading Skeleton */}
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface/85 backdrop-blur-sm z-10 transition-opacity duration-300">
          <div className="w-8 h-8 rounded-full border-2 border-accent border-t-transparent animate-spin mb-3 shadow-glow" />
          <span className="text-xs font-mono tracking-wider uppercase text-secondary">
            Initializing Foundation Engine...
          </span>
        </div>
      )}

      {/* Interactive Controls Overlay Hint */}
      {!loading && showHint && (
        <div className="absolute bottom-3 left-3 pointer-events-none text-[11px] font-mono text-secondary bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-border flex items-center gap-2 shadow-subtle">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          <span>{mode === 'scroll-exploded' ? 'Scroll to Journey · Drag 360° to Orbit' : '360° Drag to Orbit'}</span>
        </div>
      )}
    </div>
  );
};
