import React from 'react';
import { CASE_STUDIES } from '../../content/caseStudies';

export const CaseStudies: React.FC = () => {
  return (
    <section id="case-studies" className="py-20 md:py-28 bg-surface border-t border-border relative overflow-hidden">
      {/* Background Subtle Tech Grid */}
      <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none" />

      <div className="relative max-w-container mx-auto px-6 space-y-12">
        {/* Section Header */}
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-subtle border border-accent/30 text-xs font-mono uppercase tracking-wider text-accent font-semibold shadow-subtle">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Verified Deployments
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary">
            Real builds. Real impact.
          </h2>
          <p className="text-secondary text-base leading-relaxed">
            Shared foundations running in mission-critical enterprise environments where data reliability and zero downtime are non-negotiable.
          </p>
        </div>

        {/* 3 Case Study Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {CASE_STUDIES.map((study) => (
            <div
              key={study.id}
              className="p-7 rounded-2xl bg-white border border-border shadow-subtle flex flex-col justify-between hover:border-accent hover:shadow-card transition-all duration-300 group"
            >
              <div className="space-y-4">
                {/* Domain Badge */}
                <div className="text-[10px] font-mono uppercase tracking-wider text-accent font-semibold px-2.5 py-1 rounded bg-accent-subtle border border-accent/30 inline-block">
                  {study.badge}
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold tracking-tight text-primary leading-snug group-hover:text-accent transition-colors">
                  {study.title}
                </h3>

                {/* Audience / Scale */}
                <div className="text-xs font-mono text-secondary">
                  {study.audience}
                </div>

                {/* Capability Used */}
                <div className="text-xs text-primary font-medium p-3 rounded-lg bg-surface border border-border">
                  <span className="text-[10px] font-mono text-accent block uppercase mb-1 font-semibold">
                    Mounted Plates
                  </span>
                  {study.capability}
                </div>

                {/* Outcome */}
                <p className="text-xs text-secondary leading-relaxed">
                  {study.outcome}
                </p>
              </div>

              {/* Verified Metric Footer */}
              <div className="pt-6 mt-6 border-t border-border">
                <div className="text-[10px] font-mono uppercase tracking-wider text-secondary">
                  Verified Outcome
                </div>
                <div className="text-sm font-bold font-mono text-accent mt-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {study.metrics}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
