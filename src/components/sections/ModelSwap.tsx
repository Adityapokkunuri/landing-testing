import React, { useState } from 'react';
import { ThreeViewer } from '../StackVisual';
import { SWAP_PROFILES } from '../../content/swapConfigs';

interface SlotMeta {
  id: number;
  name: string;
  role: string;
}

const SLOTS: SlotMeta[] = [
  { id: 1, name: 'Base Chassis', role: 'System Anchor' },
  { id: 2, name: 'Data Ingestion', role: 'Streaming Bus' },
  { id: 3, name: 'Security Ring', role: 'Zero-Trust HSM' },
  { id: 4, name: 'Intelligence Core', role: 'AI Neural Die' },
  { id: 5, name: 'Decision Hub', role: 'Policy Engine' },
  { id: 6, name: 'Reliability Sync', role: 'Optical Coupler' },
  { id: 7, name: 'Modular Engine', role: 'Clinical CDS' },
  { id: 8, name: 'Experience Glass', role: 'Surface Mesh' },
];

export const ModelSwap: React.FC = () => {
  const [selectedLayer, setSelectedLayer] = useState<number>(4);
  const [version, setVersion] = useState<'A' | 'B'>('A');

  const currentProfile = SWAP_PROFILES[selectedLayer] || SWAP_PROFILES[4];
  const activeOption = version === 'A' ? currentProfile.versionA : currentProfile.versionB;

  const handleSelectLayer = (id: number) => {
    setSelectedLayer(id);
    setVersion('A'); // Reset to Version A when switching component
  };

  const handleTriggerSwap = (targetVersion: 'A' | 'B') => {
    setVersion(targetVersion);
  };

  return (
    <section id="model-swap" className="py-20 md:py-28 bg-surface border-t border-border relative overflow-hidden">
      {/* Background Subtle Tech Grid */}
      <div className="absolute inset-0 bg-tech-grid opacity-25 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Centered Editorial Header Hierarchy */}
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-subtle border border-accent/30 text-xs font-mono uppercase tracking-wider text-accent font-semibold shadow-subtle">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            Universal Modular Hot-Swap
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-primary leading-tight">
            The tech keeps changing. <br />
            <span className="text-secondary font-normal">Your foundation shouldn't.</span>
          </h2>

          <p className="text-base sm:text-lg text-secondary leading-relaxed">
            Every layer in our modular engine is physically decoupled and independently hot-swappable. Select any physical slot to simulate live ejection and opposite-direction insertion with zero downstream code alteration.
          </p>
        </div>

        {/* ================================================================= */}
        {/* Dual-Pane Engineering Workstation Console                         */}
        {/* Left: Spacious 3D Hardware Bay (Un-congested, airy, no clipping)  */}
        {/* Right: Integrated Rack Controller, Module Selectors & Telemetry   */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* =============================================================== */}
          {/* LEFT COLUMN: Grand 3D Assembly Bay (Col 1-7)                   */}
          {/* =============================================================== */}
          <div className="lg:col-span-7 flex flex-col space-y-3">
            {/* Console Header Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-primary font-bold">HARDWARE BUS ACTIVE</span>
                <span className="text-border">·</span>
                <span className="text-secondary">Slot 0{selectedLayer} ({currentProfile.title})</span>
              </div>
              <div className="flex items-center gap-2 bg-white px-3 py-1 rounded-full border border-border shadow-subtle text-accent font-semibold">
                <span>{activeOption.badge}</span>
                <span className="text-border">|</span>
                <span className="text-primary font-medium">{activeOption.provider}</span>
              </div>
            </div>

            {/* 3D Hardware Viewport Container */}
            <div className="relative w-full h-[520px] sm:h-[580px] lg:h-[640px] rounded-2xl bg-white border border-border shadow-card p-2 group overflow-hidden">
              <ThreeViewer
                mode="swap"
                activeLayer={selectedLayer}
                swapVersion={version}
                onLayerSelect={(id) => handleSelectLayer(id)}
                enableOrbit={true}
                transparent={true}
                showHint={false}
                className="w-full h-full rounded-xl"
              />

              {/* Top-Left Live Hardware Status Pill (Unobtrusive) */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-border text-[11px] font-mono shadow-subtle flex items-center gap-2 pointer-events-none">
                <span className={`w-2 h-2 rounded-full ${version === 'A' ? 'bg-accent' : 'bg-sky-500'} animate-pulse`} />
                <span className="text-primary font-medium">
                  Slot 0{selectedLayer}: <strong>{activeOption.name}</strong>
                </span>
              </div>

              {/* Bottom Navigation & Hot-Swap Ejection Instruction */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-[11px] font-mono pointer-events-none">
                <div className="bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-border text-secondary shadow-subtle flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span>360° Orbit Drag · Click any plate to select</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-border text-secondary shadow-subtle">
                  <span>Eject Right ➔ Insert Left</span>
                </div>
              </div>
            </div>

            {/* Sub-Viewer Status Strip */}
            <div className="flex items-center justify-between px-2 text-[11px] font-mono text-secondary">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Physical Bus Interlock: 20 mm Clean Separation
              </span>
              <span>All 8 Modules Fully Decoupled</span>
            </div>
          </div>

          {/* =============================================================== */}
          {/* RIGHT COLUMN: Interactive Control Rack & Telemetry (Col 8-12)    */}
          {/* =============================================================== */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            {/* Control Rack Box */}
            <div className="rounded-2xl bg-white border border-border shadow-card p-5 sm:p-6 space-y-5">
              {/* Rack Header */}
              <div className="border-b border-border pb-3">
                <div className="text-[11px] font-mono uppercase tracking-wider text-accent font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Modular Slot Rack
                </div>
                <h3 className="text-lg font-bold text-primary mt-1">
                  Select Component Slot
                </h3>
                <p className="text-xs text-secondary mt-0.5">
                  Click any slot below to target it for live hot-swap simulation:
                </p>
              </div>

              {/* 8-Slot Structured Rack (Clean 2-Column Grid) */}
              <div className="grid grid-cols-2 gap-2">
                {SLOTS.map((slot) => {
                  const isSelected = slot.id === selectedLayer;
                  const isHero = slot.id === 4;

                  return (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => handleSelectLayer(slot.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? isHero
                            ? 'bg-accent/10 border-accent shadow-subtle ring-1 ring-accent'
                            : 'bg-primary/5 border-primary shadow-subtle ring-1 ring-primary'
                          : 'bg-surface border-border hover:bg-white hover:border-primary/40'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className={isSelected ? 'text-accent font-bold' : 'text-secondary'}>
                          SLOT 0{slot.id}
                        </span>
                        {isSelected && (
                          <span className={`w-1.5 h-1.5 rounded-full ${isHero ? 'bg-accent' : 'bg-primary'} animate-pulse`} />
                        )}
                      </div>
                      <div className="mt-1">
                        <div className={`text-xs font-bold leading-tight ${isSelected ? 'text-primary' : 'text-primary/90'}`}>
                          {slot.name}
                        </div>
                        <div className="text-[10px] text-secondary font-mono mt-0.5 truncate">
                          {slot.role}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Active Slot Hot-Swap Module Selector (Version A vs Version B) */}
              <div className="pt-2 border-t border-border space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-mono uppercase tracking-wider text-secondary">
                    Active Module: <strong className="text-primary">{currentProfile.layerName}</strong>
                  </div>
                  <span className="text-[10px] font-mono text-accent bg-accent-subtle px-2 py-0.5 rounded border border-accent/20">
                    Hot-Swap Ready
                  </span>
                </div>

                {/* Version A vs Version B Interactive Cards */}
                <div className="space-y-2">
                  {/* Version A Card */}
                  <button
                    type="button"
                    onClick={() => handleTriggerSwap('A')}
                    className={`w-full p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between ${
                      version === 'A'
                        ? 'bg-accent-subtle/50 border-accent shadow-subtle ring-1 ring-accent'
                        : 'bg-surface border-border hover:bg-white hover:border-border-hover'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${version === 'A' ? 'bg-accent' : 'bg-secondary'}`} />
                        <span className="text-xs font-mono font-bold text-primary">
                          VERSION A · {currentProfile.versionA.name}
                        </span>
                      </div>
                      <div className="text-[11px] text-secondary font-mono pl-4">
                        Provider: {currentProfile.versionA.provider}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-[10px] font-mono px-2 py-1 rounded font-semibold ${
                        version === 'A'
                          ? 'bg-accent text-white shadow-glow'
                          : 'bg-white border border-border text-secondary'
                      }`}>
                        {version === 'A' ? 'DOCKED' : 'SWAP IN'}
                      </span>
                    </div>
                  </button>

                  {/* Version B Card */}
                  <button
                    type="button"
                    onClick={() => handleTriggerSwap('B')}
                    className={`w-full p-3 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-center justify-between ${
                      version === 'B'
                        ? 'bg-sky-50 border-sky-500 shadow-subtle ring-1 ring-sky-500'
                        : 'bg-surface border-border hover:bg-white hover:border-border-hover'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${version === 'B' ? 'bg-sky-500' : 'bg-secondary'}`} />
                        <span className="text-xs font-mono font-bold text-primary">
                          VERSION B · {currentProfile.versionB.name}
                        </span>
                      </div>
                      <div className="text-[11px] text-secondary font-mono pl-4">
                        Provider: {currentProfile.versionB.provider}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className={`text-[10px] font-mono px-2 py-1 rounded font-semibold ${
                        version === 'B'
                          ? 'bg-sky-500 text-white shadow-glow'
                          : 'bg-white border border-border text-secondary'
                      }`}>
                        {version === 'B' ? 'DOCKED' : 'HOT-SWAP'}
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Hardware Telemetry & Verified Impact */}
              <div className="pt-2 border-t border-border space-y-3">
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded-lg bg-surface border border-border">
                    <div className="text-[10px] text-secondary uppercase">
                      {activeOption.metrics.metric1Label}
                    </div>
                    <div className="font-bold text-primary mt-0.5 truncate">
                      {activeOption.metrics.metric1Value}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-lg bg-surface border border-border">
                    <div className="text-[10px] text-secondary uppercase">
                      {activeOption.metrics.metric2Label}
                    </div>
                    <div className="font-bold text-primary mt-0.5 truncate">
                      {activeOption.metrics.metric2Value}
                    </div>
                  </div>
                </div>

                {/* Zero Downstream Code Change Architectural Guarantee */}
                <div className="p-3.5 rounded-xl bg-accent-subtle/40 border border-accent/30 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-accent">
                    <svg className="w-4 h-4 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>0 LINES DOWNSTREAM CODE CHANGED</span>
                  </div>
                  <p className="text-[11px] text-secondary leading-relaxed">
                    Decoupled ABI bus contracts ensure client applications consume upgraded compute, storage, and models without recompilation, redeployment, or schema migrations.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
