// Layer specifications matching true GLTF model vertical stacking (Y axis)
export interface LayerSpec {
  id: number;
  name: string;
  thickness: number;
  baseY: number;
  camPos: [number, number, number];
  camTarget: [number, number, number];
  scrollRange: [number, number]; // Normalized scroll progress range [start, end]
  animType: 'torque' | 'packets' | 'perimeter-sweep' | 'neural-heatsink' | 'policy-gates' | 'optical-couplers' | 'cartridge-dock' | 'glass-scanline';
  datumLabel: string;
  datumCoord: [number, number, number];
  specs: {
    footprint: string;
    tolerance: string;
    material: string;
  };
}

export const LAYER_SPECS: LayerSpec[] = [
  {
    id: 1,
    name: 'Plate_01_Existing_System',
    thickness: 0.012,
    baseY: 0.0000,
    camPos: [0.32, 0.12, 0.38],
    camTarget: [0.00, 0.01, 0.00],
    scrollRange: [0.20, 0.28],
    animType: 'torque',
    datumLabel: 'CHASSIS_DATUM_ANCHOR',
    datumCoord: [0.135, 0.006, 0.085],
    specs: {
      footprint: '300 × 200 mm Base',
      tolerance: '±0.05 mm Datum Pins',
      material: 'Hardened Base Graphite',
    },
  },
  {
    id: 2,
    name: 'Plate_02_Data_In',
    thickness: 0.010,
    baseY: 0.0240,
    camPos: [0.28, 0.18, 0.32],
    camTarget: [0.00, 0.04, 0.00],
    scrollRange: [0.28, 0.36],
    animType: 'packets',
    datumLabel: 'LONGITUDINAL_BUS_CHANNELS',
    datumCoord: [0.00, 0.030, 0.090],
    specs: {
      footprint: '260 × 200 mm Flanged',
      tolerance: '4× D-Sub Connector Bays',
      material: 'Satin Titanium Alloy',
    },
  },
  {
    id: 3,
    name: 'Plate_03_Access_Security',
    thickness: 0.012,
    baseY: 0.0380,
    camPos: [0.00, 0.35, 0.32],
    camTarget: [0.00, 0.08, 0.00],
    scrollRange: [0.36, 0.44],
    animType: 'perimeter-sweep',
    datumLabel: 'ZERO_TRUST_PERIMETER_FRAME',
    datumCoord: [0.110, 0.044, 0.065],
    specs: {
      footprint: '220 × 130 mm Central Void',
      tolerance: '10.0 mm Uniform Air Gap',
      material: 'Anodized Dark Titanium',
    },
  },
  {
    id: 4,
    name: 'Plate_04_Intelligence',
    thickness: 0.016,
    baseY: 0.0400,
    camPos: [0.22, 0.26, 0.26],
    camTarget: [0.00, 0.12, 0.00],
    scrollRange: [0.44, 0.54],
    animType: 'neural-heatsink',
    datumLabel: 'NEURAL_MATRIX_CORE',
    datumCoord: [0.00, 0.056, 0.00],
    specs: {
      footprint: '90 × 90 mm Compute Die',
      tolerance: '16 Exposed Heatsink Fins',
      material: 'Signal Orange Dielectric Core',
    },
  },
  {
    id: 5,
    name: 'Plate_05_Decisions',
    thickness: 0.010,
    baseY: 0.0680,
    camPos: [0.25, 0.34, 0.30],
    camTarget: [0.00, 0.16, 0.00],
    scrollRange: [0.54, 0.62],
    animType: 'policy-gates',
    datumLabel: 'DETERMINISTIC_ROUTING_HUB',
    datumCoord: [0.00, 0.073, 0.00],
    specs: {
      footprint: '3-Branch Routing Manifold',
      tolerance: '20 mm Stepped Shelf Lands',
      material: 'Satin Titanium Matrix',
    },
  },
  {
    id: 6,
    name: 'Plate_06_Reliability_Sync',
    thickness: 0.012,
    baseY: 0.0820,
    camPos: [-0.25, 0.32, -0.32],
    camTarget: [0.00, 0.20, 0.00],
    scrollRange: [0.62, 0.70],
    animType: 'optical-couplers',
    datumLabel: 'OPTICAL_COUPLER_ARRAY',
    datumCoord: [0.060, 0.088, -0.095],
    specs: {
      footprint: '220 mm (+20 mm Rear Overhang)',
      tolerance: '6× Optical Coupler Sockets',
      material: 'Dark Titanium Spine Beams',
    },
  },
  {
    id: 7,
    name: 'Plate_07_Applications',
    thickness: 0.014,
    baseY: 0.0840,
    camPos: [0.30, 0.38, 0.28],
    camTarget: [0.00, 0.24, 0.00],
    scrollRange: [0.70, 0.78],
    animType: 'cartridge-dock',
    datumLabel: 'MODULAR_CARTRIDGE_RAILS',
    datumCoord: [0.090, 0.098, 0.00],
    specs: {
      footprint: '4× Slide-In Product Bays',
      tolerance: '8× Upward Experience Pins',
      material: 'Satin Titanium + Guide Rails',
    },
  },
  {
    id: 8,
    name: 'Plate_08_Experience',
    thickness: 0.008,
    baseY: 0.1000,
    camPos: [0.00, 0.45, 0.18],
    camTarget: [0.00, 0.28, 0.00],
    scrollRange: [0.78, 0.88],
    animType: 'glass-scanline',
    datumLabel: 'EDGE_TO_EDGE_GLASS_SURFACE',
    datumCoord: [0.00, 0.108, 0.00],
    specs: {
      footprint: '8.0 mm Low-Profile Bezel',
      tolerance: 'Tactile Datum Alignment Pads',
      material: 'Optical Glass + Orange Accent',
    },
  },
];
