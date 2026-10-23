import React, { useState, useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Button } from '../ui/Button';
import { ThreeViewer } from '../StackVisual/ThreeViewer';
import { LAYER_SPECS } from '../StackVisual/layerSpecs';
import { ARCHITECTURE_STEPS } from '../../content/steps';
import { useComponentCycle } from '../../context/ComponentCycleContext';

gsap.registerPlugin(ScrollTrigger);

interface StageInfo {
  code: string;
  name: string;
  range: [number, number];
  summary: string;
}

const STAGES: StageInfo[] = [
  { code: 'STAGE 01', name: 'UNPACKING "YOUR CORE PRODUCT"', range: [0.00, 0.40], summary: 'Enterprise casing opens and dissolves as the 8 decoupled foundational software layers glide into view.' },
  { code: 'STAGE 02', name: 'EXPANDING DECOUPLED STACK', range: [0.40, 0.75], summary: 'All 8 foundational plates separate vertically into modular inspection alignment.' },
  { code: 'STAGE 03', name: 'ARCHITECTURE MATRIX // 8 LAYERS', range: [0.75, 1.00], summary: 'Full decoupled system revealed. Click any component on the right to inspect its enterprise contract.' },
];

const LAYER_FOUNDER_LABELS: Record<number, string> = {
  1: 'Infrastructure',
  2: 'Ingestion Bus',
  3: 'Zero-Trust IAM',
  4: 'Intelligence AI',
  5: 'Decision Policy',
  6: 'Reliability Mesh',
  7: 'Modular Apps',
  8: 'Client Glass',
};

export const Hero: React.FC = () => {
  const { effectiveLayer, setActiveLayer, hoveredLayer, setHoveredLayer } = useComponentCycle();
  const [scrollProgress, setScrollProgress] = useState<number>(0.0);
  const [expandedLayerId, setExpandedLayerId] = useState<number | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const pinTargetRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  // Stack unpacks once user scrolls past 0.25 or explicitly clicks a component
  const isExpanded = scrollProgress >= 0.25 || expandedLayerId !== null;

  // Smooth fade-in for the right-side architecture buttons as the stack glides to the left
  const rightPanelOpacity = scrollProgress >= 0.70 || expandedLayerId !== null
    ? 1.0
    : Math.min(Math.max((scrollProgress - 0.25) / 0.45, 0), 1.0);

  // Active highlighted layer in 3D: ONLY when clicked or explicitly hovered!
  // No scroll-jacking or automatic cycling through layers on scroll!
  const currentPlateId = useMemo(() => {
    if (expandedLayerId !== null) return expandedLayerId;
    if (hoveredLayer !== null && hoveredLayer !== undefined) return hoveredLayer;
    return null;
  }, [expandedLayerId, hoveredLayer]);

  const handleToggleLayer = (id: number) => {
    if (expandedLayerId === id) {
      setExpandedLayerId(null);
      setActiveLayer(id);
    } else {
      setExpandedLayerId(id);
      setActiveLayer(id);
    }
  };

  // Synchronize effective layer with context when active
  useEffect(() => {
    if (currentPlateId && currentPlateId !== effectiveLayer) {
      setActiveLayer(currentPlateId);
    }
  }, [currentPlateId, effectiveLayer, setActiveLayer]);

  // Active step for expanded specs
  const activeStepId = currentPlateId || 8;
  const step = useMemo(() => {
    return ARCHITECTURE_STEPS.find((s) => s.plateId === activeStepId) || ARCHITECTURE_STEPS[0];
  }, [activeStepId]);

  // Active stage information
  const currentStage = useMemo(() => {
    if (expandedLayerId !== null) {
      return {
        code: `TIER 0${expandedLayerId}`,
        name: LAYER_FOUNDER_LABELS[expandedLayerId] || 'ACTIVE COMPONENT',
        range: [0, 1] as [number, number],
        summary: step.founderROI,
      };
    }
    return STAGES.find((s) => scrollProgress >= s.range[0] && scrollProgress <= s.range[1]) || STAGES[STAGES.length - 1];
  }, [scrollProgress, expandedLayerId, step]);

  // GSAP ScrollTrigger Pinned Setup
  useEffect(() => {
    const container = containerRef.current;
    const pinTarget = pinTargetRef.current;
    if (!container || !pinTarget) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      const trigger = ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: '+=100%', // 100% of viewport height provides smooth scrub to unpack, eliminating unnecessary scroll-jacking
        pin: pinTarget,
        scrub: 0.5, // Crisp, responsive tactile scrub
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

  const scrollToExplorer = () => {
    const trigger = scrollTriggerRef.current;
    if (trigger) {
      const targetScroll = trigger.start + 0.95 * (trigger.end - trigger.start);
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    } else if (containerRef.current) {
      containerRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    const current = expandedLayerId || 1;
    const prevId = current > 1 ? current - 1 : 8;
    handleToggleLayer(prevId);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    const current = expandedLayerId || 1;
    const nextId = current < 8 ? current + 1 : 1;
    handleToggleLayer(nextId);
  };

  return (
    <section className="relative bg-surface">
      {/* Background Architectural Tech Grid */}
      <div className="absolute inset-0 bg-tech-grid opacity-30 pointer-events-none" />

      {/* ================================================================= */}
      {/* 1. Centered Editorial Header Hierarchy                            */}
      {/* ================================================================= */}
      <div className="relative max-w-4xl mx-auto px-6 text-center space-y-6 pt-10 pb-12 md:pt-16 md:pb-16">
        {/* Operational Status Pill */}
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-border text-xs font-mono text-secondary shadow-subtle">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-primary font-semibold tracking-wide">ENTERPRISE FOUNDATION OS</span>
          <span className="text-border">|</span>
          <span className="text-accent font-medium">DECOUPLED ARCHITECTURE</span>
        </div>

        {/* Grand Centered Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-primary leading-[1.08]">
          Build faster on an engine that's <br className="hidden sm:inline" />
          <span className="text-accent underline decoration-accent/30 underline-offset-8">already engineered.</span>
        </h1>

        {/* Centered Supporting Technical Copy */}
        <p className="text-base sm:text-lg text-secondary leading-relaxed max-w-2xl mx-auto">
          An elite shared foundation OS provides multi-cloud datum, zero-trust security, and a frontier neural bus once — so every engineering squad only builds what makes them unique.
        </p>

        {/* Centered Dual Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <Button variant="primary" size="lg" asAnchor href="#contact" className="shadow-glow hover:shadow-glow-lg transition-shadow">
            Talk to engineering
          </Button>
          <button
            onClick={scrollToExplorer}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border bg-white text-primary font-medium hover:bg-surface hover:border-primary transition-all duration-200 shadow-subtle text-base cursor-pointer"
          >
            <span>Explore 8-Layer Stack</span>
            <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>

        {/* Centered Live Telemetry Metrics Row */}
        <div className="pt-6 border-t border-border flex items-center justify-center gap-6 sm:gap-12 max-w-xl mx-auto">
          <div className="text-center space-y-0.5">
            <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-primary">50+</div>
            <div className="text-[11px] text-secondary font-mono uppercase tracking-wider flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Builds Online
            </div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center space-y-0.5">
            <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-primary">30+</div>
            <div className="text-[11px] text-secondary font-mono uppercase tracking-wider flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              Hospitals Active
            </div>
          </div>
          <div className="h-8 w-px bg-border" />
          <div className="text-center space-y-0.5">
            <div className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-primary">10+</div>
            <div className="text-[11px] text-secondary font-mono uppercase tracking-wider flex items-center justify-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-600" />
              Institutions
            </div>
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* 2. Unified Scroll-Driven 3D Architecture Explorer (Pinned)        */}
      {/* ================================================================= */}
      <div id="components" ref={containerRef} className="relative border-t border-border bg-surface">
        <div
          ref={pinTargetRef}
          className="relative w-full min-h-screen flex flex-col justify-between py-4 sm:py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto overflow-hidden select-none"
        >
          {/* Top Telemetry & Control Ribbon */}
          <div className="w-full space-y-3 mb-2 sm:mb-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-3">
              <div className="flex items-center gap-3">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-subtle border border-accent/30 text-xs font-mono font-semibold text-accent shadow-subtle">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  {currentStage.code}: {currentStage.name}
                </div>
                <h2 className="text-lg sm:text-xl font-bold tracking-tight text-primary hidden md:inline">
                  Decoupled Architecture Explorer
                </h2>
              </div>

              {/* Progress readout & status */}
              <div className="flex items-center gap-4 text-xs font-mono text-secondary">
                <span className="hidden sm:inline text-[11px] text-secondary">
                  {currentStage.summary}
                </span>
                <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-border shadow-subtle">
                  <span className="text-primary font-bold">{Math.round(scrollProgress * 100)}%</span>
                  <span className="text-border">|</span>
                  <span className="text-accent uppercase tracking-wider">
                    {!isExpanded
                      ? 'Sealed Product'
                      : expandedLayerId !== null
                      ? `Plate 0${expandedLayerId} Active`
                      : '8 Layers Ready'}
                  </span>
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
          </div>

          {/* =============================================================== */}
          {/* Main Visual Arena: Full-Width Centered 3D Stage & Connected Rack*/}
          {/* =============================================================== */}
          <div className="relative w-full flex-1 min-h-[520px] sm:min-h-[580px] lg:min-h-[calc(100vh-200px)] overflow-hidden">
            {/* Full-Width 3D Canvas: Dead-center initially, glides left on scroll */}
            <div className="absolute inset-0 w-full h-full">
              <ThreeViewer
                mode="scroll-exploded"
                activeLayer={currentPlateId}
                progress={scrollProgress}
                hoverExplode={false}
                onLayerSelect={(id) => handleToggleLayer(id)}
                onLayerHover={(id) => setHoveredLayer(id)}
                enableOrbit={true}
                autoRotate={false}
                transparent={true}
                className="w-full h-full"
              />
            </div>

            {/* Dynamic HUD Overlays */}
            {!isExpanded ? (
              <>
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-border text-[11px] font-mono shadow-subtle flex items-center gap-2 pointer-events-none transition-all">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-primary font-medium">
                    "YOUR CORE PRODUCT" · What Your Enterprise Customers See
                  </span>
                </div>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur-md px-5 py-2.5 rounded-full border border-border text-xs font-mono text-secondary shadow-card flex items-center gap-2.5 pointer-events-none transition-all">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-primary font-semibold">
                    Scroll Down to Unpack & Reveal Decoupled Architecture &darr;
                  </span>
                </div>
              </>
            ) : (
              <>
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-border text-[11px] font-mono text-primary shadow-subtle flex items-center gap-2 pointer-events-none transition-all">
                  <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                  <span>
                    {expandedLayerId !== null ? (
                      <><strong>0{expandedLayerId}</strong> · {step.title} (Inspecting)</>
                    ) : (
                      <><strong>8-Layer Modular Stack</strong> · Decoupled Enterprise OS</>
                    )}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 hidden sm:flex items-center gap-2 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full border border-border text-[11px] font-mono text-secondary shadow-subtle pointer-events-none">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>360° Drag to Orbit · Click any plate or right button to expand</span>
                </div>
              </>
            )}

            {/* Right Architecture Column: Connected 8-Layer Component Stack Rack */}
            {/* Smoothly fades in once stack unpacks; components expand on user click */}
            {isExpanded && (
              <div
                style={{ opacity: rightPanelOpacity }}
                className="absolute right-0 top-0 bottom-0 w-full sm:w-[88%] md:w-[70%] lg:w-[50%] xl:w-[46%] flex flex-col justify-center px-3 sm:px-6 lg:px-8 pointer-events-auto z-10 transition-opacity duration-300"
              >
                <div className="space-y-2 max-h-[calc(100vh-190px)] overflow-y-auto pr-1">
                  {[...LAYER_SPECS].sort((a, b) => b.id - a.id).map((spec) => {
                    const isClicked = spec.id === expandedLayerId;
                    const isCurrent = spec.id === currentPlateId;
                    const layerStep = ARCHITECTURE_STEPS.find((s) => s.plateId === spec.id) || step;

                    return (
                      <div key={spec.id} className="flex items-center gap-2 group">
                        {/* Dotted Line connecting each component to the right */}
                        <div className="hidden sm:flex items-center w-8 sm:w-14 lg:w-20 shrink-0 pointer-events-none">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 -mr-1 transition-all duration-300 ${
                              isClicked || isCurrent
                                ? 'bg-accent shadow-[0_0_8px_rgba(255,85,0,0.9)]'
                                : 'bg-border/80 group-hover:bg-accent/40'
                            }`}
                          />
                          <div
                            className={`flex-1 border-t-2 border-dotted transition-colors duration-300 ${
                              isClicked || isCurrent
                                ? 'border-accent shadow-[0_0_8px_rgba(255,85,0,0.8)]'
                                : 'border-border/80 group-hover:border-accent/40'
                            }`}
                          />
                          <span
                            className={`w-2.5 h-2.5 rounded-full shrink-0 -ml-1 transition-all duration-300 ${
                              isClicked || isCurrent
                                ? 'bg-accent ring-4 ring-accent/25 animate-pulse'
                                : 'bg-border group-hover:bg-accent/40'
                            }`}
                          />
                        </div>

                        {/* Button / Expanded Dossier */}
                        <div className="flex-1 min-w-0">
                          {isClicked ? (
                            /* Expanded Component Dossier Card */
                            <div className="w-full bg-white rounded-2xl border-2 border-accent p-4 sm:p-5 shadow-card space-y-3.5 transition-all duration-300">
                              {/* Header */}
                              <div className="flex items-center justify-between border-b border-border pb-2.5">
                                <div>
                                  <div className="text-[11px] font-mono font-bold tracking-wider text-accent uppercase flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                                    0{spec.id} // {LAYER_FOUNDER_LABELS[spec.id]}
                                  </div>
                                  <div className="text-sm sm:text-base font-bold text-primary mt-0.5">
                                    {layerStep.title}
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] font-mono text-secondary px-2 py-0.5 rounded bg-surface border border-border">
                                    {layerStep.architectureTier}
                                  </span>
                                  <div className="flex items-center gap-1 ml-1">
                                    <button
                                      onClick={handlePrev}
                                      className="w-6 h-6 rounded border border-border bg-surface hover:bg-white flex items-center justify-center text-primary text-xs transition-colors cursor-pointer"
                                      title="Previous layer"
                                    >
                                      &larr;
                                    </button>
                                    <button
                                      onClick={handleNext}
                                      className="w-6 h-6 rounded border border-border bg-surface hover:bg-white flex items-center justify-center text-primary text-xs transition-colors cursor-pointer"
                                      title="Next layer"
                                    >
                                      &rarr;
                                    </button>
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setExpandedLayerId(null);
                                    }}
                                    className="w-6 h-6 rounded-md border border-border bg-surface hover:bg-white flex items-center justify-center text-secondary hover:text-primary transition-colors cursor-pointer text-xs ml-1"
                                    title="Collapse"
                                  >
                                    &times;
                                  </button>
                                </div>
                              </div>

                              {/* Live Enterprise Protocol Contract Terminal */}
                              <div className="w-full rounded-xl bg-[#090B0E] border border-white/10 p-3 font-mono text-[11px] shadow-inner space-y-1.5 text-white">
                                <div className="flex items-center justify-between border-b border-white/10 pb-1.5 text-[10px]">
                                  <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                    ENTERPRISE CONTRACT // TIER 0{spec.id}
                                  </span>
                                  <span className="text-accent font-semibold">0 CODE REWRITES</span>
                                </div>
                                <div className="space-y-1 text-[10px]">
                                  <div className="flex items-start gap-1.5 truncate">
                                    <span className="text-white/40 uppercase">INTERFACE:</span>
                                    <span className="text-white font-medium truncate">{layerStep.softwareSpecs.interfaceProtocol}</span>
                                  </div>
                                  <div className="flex items-start gap-1.5 truncate">
                                    <span className="text-white/40 uppercase">SECURITY:</span>
                                    <span className="text-emerald-400 font-medium truncate">{layerStep.softwareSpecs.securityCompliance}</span>
                                  </div>
                                  <div className="flex items-start gap-1.5 truncate">
                                    <span className="text-white/40 uppercase">RUNTIME SLA:</span>
                                    <span className="text-cyan-400 font-medium truncate">{layerStep.softwareSpecs.runtimeSLA}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Founder Strategic ROI */}
                              <div className="p-2.5 rounded-lg bg-accent-subtle/50 border border-accent/25 text-xs space-y-0.5">
                                <div className="text-[10px] font-mono font-bold text-accent uppercase tracking-wider flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                                  Founder Strategic Advantage & ROI
                                </div>
                                <p className="text-[11px] text-primary font-medium leading-relaxed">
                                  {layerStep.founderROI}
                                </p>
                              </div>
                            </div>
                          ) : (
                            /* Clean Unexpanded Button */
                            <button
                              onClick={() => handleToggleLayer(spec.id)}
                              onMouseEnter={() => setHoveredLayer(spec.id)}
                              onMouseLeave={() => setHoveredLayer(null)}
                              className={`w-full rounded-xl border px-3.5 py-2.5 flex items-center justify-between text-left transition-all duration-200 shadow-subtle hover:shadow-card cursor-pointer group ${
                                isCurrent
                                  ? 'bg-white border-accent shadow-glow'
                                  : 'bg-white/90 hover:bg-white border-border hover:border-accent/50'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <span className={`w-6 h-6 rounded-md flex items-center justify-center font-mono text-[11px] font-bold transition-colors ${
                                  isCurrent
                                    ? 'bg-accent text-white'
                                    : 'bg-surface border border-border text-secondary group-hover:text-accent group-hover:border-accent/40'
                                }`}>
                                  0{spec.id}
                                </span>
                                <span className={`text-xs font-semibold transition-colors ${
                                  isCurrent ? 'text-accent' : 'text-primary group-hover:text-accent'
                                }`}>
                                  {LAYER_FOUNDER_LABELS[spec.id]}
                                </span>
                              </div>

                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono text-secondary truncate max-w-[130px] hidden sm:inline">
                                  {spec.datumLabel}
                                </span>
                                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-accent-subtle/70 text-accent border border-accent/20 group-hover:bg-accent group-hover:text-white transition-colors">
                                  Inspect +
                                </span>
                              </div>
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Bottom Technical Status Bar */}
          <div className="pt-2 border-t border-border flex items-center justify-between text-[11px] font-mono text-secondary">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Shared Foundation Engine: Synchronized 3D Bus Active</span>
            </div>
            <div className="hidden sm:inline">
              Scroll to unpack architecture · Click any layer or button to expand enterprise dossier
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
