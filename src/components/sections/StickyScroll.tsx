import React, { useEffect, useRef, useState, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ARCHITECTURE_STEPS } from '../../content/steps';
import { ThreeViewer } from '../StackVisual/ThreeViewer';
import { LAYER_SPECS, type LayerSpec } from '../StackVisual/layerSpecs';
import { useComponentCycle } from '../../context/ComponentCycleContext';

gsap.registerPlugin(ScrollTrigger);

interface StageInfo {
  code: string;
  name: string;
  range: [number, number];
  summary: string;
}

const STAGES: StageInfo[] = [
  { code: 'STAGE A', name: 'FULL STACK OVERVIEW', range: [0.00, 0.20], summary: 'Engine locked at 0.5mm datum interlock, expanding to full 38.0mm separation.' },
  { code: 'STAGE B', name: 'BASE & INGESTION', range: [0.20, 0.44], summary: 'Chassis datum anchor (01), streaming bus (02), and zero-trust perimeter (03).' },
  { code: 'STAGE C', name: 'INTELLIGENCE ENGINE', range: [0.44, 0.62], summary: 'Hot-swappable AI compute die (04) and deterministic policy routing channels (05).' },
  { code: 'STAGE D', name: 'RELIABILITY & APPS', range: [0.62, 0.78], summary: 'Distributed optical sync mesh (06) and slide-in application cartridges (07).' },
  { code: 'STAGE E', name: 'PRESENTATION & REVIEW', range: [0.78, 1.00], summary: 'Tactile glass surface (08) pulling back to inspect the complete decoupled architecture.' },
];

export const StickyScroll: React.FC = () => {
  const { effectiveLayer, setActiveLayer, setHoveredLayer } = useComponentCycle();
  const [scrollProgress, setScrollProgress] = useState<number>(0.24);

  const containerRef = useRef<HTMLDivElement>(null);
  const pinTargetRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  // Determine current active plate and stage based on scroll progress
  const currentPlateId = useMemo(() => {
    if (scrollProgress < 0.20) return 1;
    if (scrollProgress >= 0.88) return 8;
    for (const spec of LAYER_SPECS) {
      if (scrollProgress >= spec.scrollRange[0] && scrollProgress < spec.scrollRange[1]) {
        return spec.id;
      }
    }
    return effectiveLayer || 4;
  }, [scrollProgress, effectiveLayer]);

  // Synchronize effective layer with context
  useEffect(() => {
    if (currentPlateId && currentPlateId !== effectiveLayer) {
      setActiveLayer(currentPlateId);
    }
  }, [currentPlateId, effectiveLayer, setActiveLayer]);

  // Current stage information
  const currentStage = useMemo(() => {
    return STAGES.find((s) => scrollProgress >= s.range[0] && scrollProgress <= s.range[1]) || STAGES[1];
  }, [scrollProgress]);

  // Architectural step and physical layer specs
  const step = useMemo(() => {
    return ARCHITECTURE_STEPS.find((s) => s.plateId === currentPlateId) || ARCHITECTURE_STEPS[0];
  }, [currentPlateId]);

  const layerSpec: LayerSpec = useMemo(() => {
    return LAYER_SPECS.find((s) => s.id === currentPlateId) || LAYER_SPECS[0];
  }, [currentPlateId]);

  // Pinned GSAP ScrollTrigger setup
  useEffect(() => {
    const container = containerRef.current;
    const pinTarget = pinTargetRef.current;
    if (!container || !pinTarget) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      // Accessible fallback: disable heavy scroll pinning
      return;
    }

    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: '+=280%', // 280% of viewport height provides smooth, deliberate scrubbing
        pin: pinTarget,
        scrub: 0.8, // Tactile mechanical inertia
        anticipatePin: 1,
        onUpdate: (self) => {
          setScrollProgress(self.progress);
        },
      });
      scrollTriggerRef.current = trigger;
    }, container);

    return () => {
      ctx.revert();
      scrollTriggerRef.current = null;
    };
  }, []);

  // Jump to specific layer position smoothly
  const jumpToLayer = (plateId: number) => {
    const targetSpec = LAYER_SPECS.find((s) => s.id === plateId);
    if (!targetSpec) return;

    const targetProgress = (targetSpec.scrollRange[0] + targetSpec.scrollRange[1]) / 2;
    const trigger = scrollTriggerRef.current;

    if (trigger) {
      const targetScroll = trigger.start + targetProgress * (trigger.end - trigger.start);
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    } else {
      setScrollProgress(targetProgress);
      setActiveLayer(plateId);
    }
  };

  const handlePrev = () => {
    const prevId = currentPlateId > 1 ? currentPlateId - 1 : 8;
    jumpToLayer(prevId);
  };

  const handleNext = () => {
    const nextId = currentPlateId < 8 ? currentPlateId + 1 : 1;
    jumpToLayer(nextId);
  };

  return (
    <section id="components" ref={containerRef} className="relative bg-surface border-t border-border">
      {/* Background Architectural Grid Pattern */}
      <div className="absolute inset-0 bg-tech-grid opacity-25 pointer-events-none" />

      {/* Pinned Full-Screen Experience Container */}
      <div
        ref={pinTargetRef}
        className="relative w-full min-h-screen flex flex-col justify-between py-4 sm:py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden select-none"
      >
        {/* ================================================================= */}
        {/* Top Header & Telemetry Ribbon                                     */}
        {/* ================================================================= */}
        <div className="w-full space-y-3 mb-2 sm:mb-4">
          {/* Main Title & Stage Indicator */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-subtle border border-accent/30 text-xs font-mono font-semibold text-accent shadow-subtle">
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                {currentStage.code}: {currentStage.name}
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-primary hidden md:inline">
                Architecture Explorer
              </h2>
            </div>

            {/* Live Progress Meter & Stage Summary */}
            <div className="flex items-center gap-4 text-xs font-mono text-secondary">
              <span className="hidden sm:inline text-[11px] text-secondary">
                {currentStage.summary}
              </span>
              <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-border shadow-subtle">
                <span className="text-primary font-bold">{Math.round(scrollProgress * 100)}%</span>
                <span className="text-border">|</span>
                <span className="text-accent uppercase tracking-wider">Scrubbed</span>
              </div>
            </div>
          </div>

          {/* Precision Scrub Progress Bar */}
          <div className="w-full h-1 bg-border/60 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent transition-all duration-150 ease-out"
              style={{ width: `${Math.min(Math.max(scrollProgress * 100, 0), 100)}%` }}
            />
          </div>

          {/* Quick-Jump 8-Module Stack Registry Buttons */}
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5 pt-1">
            {LAYER_SPECS.map((spec) => {
              const isSelected = spec.id === currentPlateId;
              const isHeroAI = spec.id === 4;

              return (
                <button
                  key={spec.id}
                  onClick={() => jumpToLayer(spec.id)}
                  onMouseEnter={() => setHoveredLayer(spec.id)}
                  onMouseLeave={() => setHoveredLayer(null)}
                  className={`px-2 py-1.5 rounded-lg border text-[11px] font-mono transition-all duration-200 flex items-center justify-between cursor-pointer truncate ${
                    isSelected
                      ? isHeroAI
                        ? 'bg-accent text-white border-accent shadow-glow font-bold'
                        : 'bg-primary text-white border-primary shadow-subtle font-bold'
                      : 'bg-white/80 border-border text-secondary hover:bg-white hover:text-primary hover:border-secondary'
                  }`}
                  title={spec.datumLabel}
                >
                  <span className="truncate">0{spec.id} {spec.name.replace('Plate_0', '').replace('_', ' ').split(' ')[1]}</span>
                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white ml-1 shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* ================================================================= */}
        {/* Main Split Body: 3D Exploded Flight Canvas & Technical Dossier    */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-stretch flex-1 min-h-0 py-2">
          {/* Left Column (Col 1-7): Prominent 3D Exploded Flight Canvas */}
          <div className="lg:col-span-7 relative w-full h-[360px] sm:h-[420px] lg:h-full rounded-2xl bg-white border border-border shadow-card p-2 flex flex-col group overflow-hidden">
            {/* 3D WebGL Viewer in scroll-exploded mode */}
            <ThreeViewer
              mode="scroll-exploded"
              activeLayer={currentPlateId}
              progress={scrollProgress}
              onLayerSelect={(id) => jumpToLayer(id)}
              onLayerHover={(id) => setHoveredLayer(id)}
              enableOrbit={true}
              autoRotate={false}
              transparent={true}
              className="w-full h-full rounded-xl"
            />

            {/* Top-Left Live Datum HUD Overlay */}
            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-border text-[11px] font-mono text-primary shadow-subtle flex items-center gap-2 pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
              <span>
                <strong>0{layerSpec.id}</strong> · {layerSpec.datumLabel}
              </span>
            </div>

            {/* Top-Right Precision Coordinate Readout */}
            <div className="absolute top-4 right-4 hidden sm:flex items-center gap-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full border border-border text-[10px] font-mono text-secondary pointer-events-none shadow-subtle">
              <span>COORD: [{layerSpec.datumCoord.map((c) => c.toFixed(3)).join(', ')}]</span>
            </div>

            {/* Bottom Floating Orbit & Scrub Guide */}
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono pointer-events-none">
              <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full border border-border text-secondary shadow-subtle flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Scroll to scrub camera · 360° Drag to Orbit</span>
              </div>
              <div className="hidden md:flex items-center gap-2 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full border border-border text-accent shadow-subtle">
                <span>DATUM PIN: {layerSpec.specs.tolerance}</span>
              </div>
            </div>
          </div>

          {/* Right Column (Col 8-12): Technical Component Dossier Card */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-border p-5 sm:p-6 shadow-card flex flex-col justify-between space-y-4 overflow-y-auto max-h-[460px] lg:max-h-none">
            {/* Dossier Header & Prev/Next Step Controls */}
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <div className="text-[11px] font-mono font-bold tracking-wider text-accent uppercase flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  {step.category}
                </div>
                <div className="text-xs font-mono text-secondary mt-0.5">
                  Plate 0{step.plateId} of 08
                </div>
              </div>

              {/* Prev / Next Jump Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={handlePrev}
                  className="w-8 h-8 rounded-lg border border-border bg-surface hover:bg-white hover:border-primary flex items-center justify-center text-primary transition-colors cursor-pointer"
                  aria-label="Previous component"
                  title="Previous component"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={handleNext}
                  className="w-8 h-8 rounded-lg border border-border bg-surface hover:bg-white hover:border-primary flex items-center justify-center text-primary transition-colors cursor-pointer"
                  aria-label="Next component"
                  title="Next component"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* High-Resolution Component Render Preview */}
            <div className="relative aspect-[16/9] w-full rounded-xl bg-surface border border-border p-3 flex items-center justify-center overflow-hidden group">
              <img
                key={step.plateId}
                src={`/layers/plate-${step.plateId}.png`}
                alt={step.title}
                className="w-full h-full object-contain transition-all duration-300 group-hover:scale-105"
              />
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-white/95 border border-border text-[10px] font-mono text-accent shadow-subtle">
                PLATE_0{step.plateId}_SPEC
              </div>
            </div>

            {/* Title & Core Architectural Description */}
            <div className="space-y-1.5">
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">
                {step.title}
              </h3>
              <p className="text-xs sm:text-sm text-secondary leading-relaxed">
                {step.description}
              </p>
            </div>

            {/* Why Shared Foundation? Rationale */}
            <div className="p-3.5 rounded-xl bg-surface border border-border space-y-1">
              <div className="text-[11px] font-mono font-semibold text-primary uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                Why Shared Foundation?
              </div>
              <p className="text-xs text-secondary leading-relaxed">
                {step.whyShared}
              </p>
            </div>

            {/* Precision Physical Specifications Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
              <div className="p-2.5 rounded-lg border border-border bg-surface">
                <div className="text-[10px] text-secondary uppercase">Footprint</div>
                <div className="font-semibold text-primary mt-0.5 truncate">{layerSpec.specs.footprint}</div>
              </div>
              <div className="p-2.5 rounded-lg border border-border bg-surface">
                <div className="text-[10px] text-secondary uppercase">Tolerance</div>
                <div className="font-semibold text-primary mt-0.5 truncate">{layerSpec.specs.tolerance}</div>
              </div>
              <div className="p-2.5 rounded-lg border border-border bg-surface">
                <div className="text-[10px] text-secondary uppercase">Material Finish</div>
                <div className="font-semibold text-primary mt-0.5 truncate">{layerSpec.specs.material}</div>
              </div>
              <div className="p-2.5 rounded-lg border border-border bg-surface">
                <div className="text-[10px] text-secondary uppercase">Thickness</div>
                <div className="font-semibold text-accent mt-0.5">{step.thickness}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Technical Status Bar */}
        <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] font-mono text-secondary">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Shared Foundation Engine: Synchronized 3D Bus Active</span>
          </div>
          <div className="hidden sm:inline">
            Use mouse wheel or touch scroll to navigate between architectural stages
          </div>
        </div>
      </div>
    </section>
  );
};
