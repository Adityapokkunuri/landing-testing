import React from 'react';
import { STATS } from '../../content/stats';

export const ProofStrip: React.FC = () => {
  const renderIcon = (type: string) => {
    switch (type) {
      case 'cube':
        return (
          <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        );
      case 'hospital':
        return (
          <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'pillars':
      default:
        return (
          <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
          </svg>
        );
    }
  };

  return (
    <section id="proof" className="py-10 border-y border-border bg-surface relative overflow-hidden">
      {/* Background Subtle Scanline Grid */}
      <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none" />

      <div className="relative max-w-container mx-auto px-6 space-y-6">
        {/* Telemetry Status Ribbon */}
        <div className="flex flex-wrap items-center justify-between text-xs font-mono text-secondary border-b border-border pb-3 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-primary font-semibold">LIVE PRODUCTION TELEMETRY</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>UPTIME: <strong className="text-primary">99.998%</strong></span>
            <span>REWRITE RATIO: <strong className="text-accent">0.00%</strong></span>
            <span>SPEC: <strong className="text-primary">TITANIUM CHASSIS</strong></span>
          </div>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STATS.map((stat, idx) => (
            <div
              key={stat.id}
              className="group p-5 rounded-xl border border-border bg-white hover:border-accent/50 hover:shadow-subtle transition-all duration-300 relative overflow-hidden flex flex-col justify-between shadow-subtle"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 rounded-lg bg-surface border border-border shrink-0 shadow-subtle group-hover:scale-105 transition-transform">
                  {renderIcon(stat.icon)}
                </div>
                <div className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-secondary">
                  SYS_METRIC_0{idx + 1}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-bold font-mono tracking-tight text-primary">
                    {stat.value}
                  </span>
                  <span className="text-xs font-mono font-semibold tracking-wider text-accent uppercase">
                    {stat.label}
                  </span>
                </div>
                <p className="text-xs text-secondary leading-relaxed">
                  {stat.description}
                </p>
              </div>

              {/* Progress Ticker Bar */}
              <div className="pt-4 mt-2">
                <div className="w-full h-1 bg-surface-subtle rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-1000"
                    style={{ width: `${80 + idx * 8}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
