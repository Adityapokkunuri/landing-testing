import React from 'react';
import { BUILDERS_TIMELINE } from '../../content/builders';

export const Builders: React.FC = () => {
  return (
    <section id="builders" className="py-20 md:py-28 bg-surface border-t border-border relative overflow-hidden">
      {/* Background Subtle Tech Grid */}
      <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none" />

      <div className="relative max-w-container mx-auto px-6 space-y-12">
        {/* Section Header */}
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-subtle border border-accent/30 text-xs font-mono uppercase tracking-wider text-accent font-semibold shadow-subtle">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Engineering Guild
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary">
            Engineered by systems architects.
          </h2>
          <p className="text-secondary text-base leading-relaxed">
            A tight-knit engineering core with deep experience in distributed systems, high-frequency physical hardware interfacing, and real-time WebGL engines.
          </p>
        </div>

        {/* 4-Node Connected Timeline */}
        <div className="relative">
          {/* Connecting Line across desktop */}
          <div className="hidden lg:block absolute top-8 left-8 right-8 h-0.5 bg-border -z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {BUILDERS_TIMELINE.map((node) => (
              <div
                key={node.id}
                className={`p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                  node.isLead
                    ? 'bg-white border-accent shadow-card'
                    : 'bg-white border-border shadow-subtle hover:border-accent hover:shadow-card'
                }`}
              >
                <div>
                  {/* Top Node Indicator & Tenure */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        node.isLead
                          ? 'border-accent bg-accent-subtle'
                          : 'border-secondary bg-surface'
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          node.isLead ? 'bg-accent animate-pulse' : 'bg-primary'
                        }`}
                      />
                    </div>
                    <span className="text-xs font-mono font-bold text-secondary bg-surface px-2.5 py-0.5 rounded border border-border">
                      {node.tenure}
                    </span>
                  </div>

                  {/* Role Title */}
                  <h3 className="text-lg font-bold tracking-tight text-primary mb-1">
                    {node.role}
                  </h3>

                  {/* Focus Subhead */}
                  <div className="text-xs font-mono text-accent mb-3 font-semibold">
                    {node.focus}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-secondary leading-relaxed">
                    {node.description}
                  </p>
                </div>

                {node.isLead && (
                  <div className="mt-6 pt-3 border-t border-border flex items-center gap-1.5 text-[11px] font-mono text-accent font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                    FOUNDATION STEWARD
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
