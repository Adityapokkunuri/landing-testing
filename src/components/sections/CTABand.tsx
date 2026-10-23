import React, { useState } from 'react';
import { Button } from '../ui/Button';

export const CTABand: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <section id="contact" className="py-20 md:py-28 bg-surface border-t border-border relative overflow-hidden">
      {/* Background Subtle Tech Grid */}
      <div className="absolute inset-0 bg-tech-grid opacity-20 pointer-events-none" />

      <div className="relative max-w-container mx-auto px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* Section Heading */}
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-subtle border border-accent/30 text-xs font-mono uppercase tracking-wider text-accent font-semibold shadow-subtle">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Deployment Console
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-primary">
              Ready to deploy your shared foundation?
            </h2>

            <p className="text-base sm:text-lg text-secondary leading-relaxed max-w-xl mx-auto">
              Eliminate redundant architecture cycles. Interlock 8 pre-engineered capability plates onto your existing enterprise stack.
            </p>
          </div>

          {/* Interactive Terminal Console Container */}
          <div className="rounded-2xl bg-white border border-border shadow-card overflow-hidden">
            {/* Terminal Header Bar */}
            <div className="px-4 py-3 bg-surface border-b border-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <div className="text-xs font-mono text-secondary">
                bash: shared-engine-cli v3.2
              </div>
              <div className="text-[10px] font-mono text-accent font-semibold">
                ONLINE
              </div>
            </div>

            {/* Terminal Screen Body */}
            <div className="p-6 font-mono text-xs sm:text-sm space-y-2 bg-[#141619] text-[#E0E2E6]">
              <div className="text-[#88929E] flex items-center gap-2">
                <span className="text-accent">$</span>
                <span className="text-white font-semibold">shared-foundation init --target=enterprise-vpc --modules=8</span>
              </div>
              <div className="text-emerald-400 pl-4 flex items-center gap-2">
                <span>✓</span>
                <span>Chassis datum anchor verified (Plate 01 - 300x200mm)</span>
              </div>
              <div className="text-emerald-400 pl-4 flex items-center gap-2">
                <span>✓</span>
                <span>Streaming bus & zero-trust perimeter locked (Plates 02-03)</span>
              </div>
              <div className="text-accent pl-4 flex items-center gap-2 font-semibold">
                <span>●</span>
                <span>Neural compute core hot-swap interface active (Plate 04)</span>
              </div>
              <div className="text-emerald-400 pl-4 flex items-center gap-2">
                <span>✓</span>
                <span>Deterministic sync & UI micro-surfaces mounted (Plates 05-08)</span>
              </div>
              <div className="text-white pl-4 pt-1 font-semibold flex items-center gap-2">
                <span className="text-accent">→</span>
                <span>Foundation verified: 0 lines of legacy code rewritten.</span>
              </div>
            </div>

            {/* Direct Inquiry Form inside console */}
            <div className="p-6 bg-white border-t border-border">
              {!submitted ? (
                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="relative w-full">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-xs text-accent">
                      &gt;
                    </span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="enter your work email for engineering brief..."
                      className="w-full pl-8 pr-4 py-3 rounded-xl bg-surface border border-border text-xs sm:text-sm font-mono text-primary placeholder:text-muted focus:outline-none focus:border-accent shadow-subtle"
                    />
                  </div>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full sm:w-auto shrink-0 shadow-glow font-mono text-xs"
                  >
                    Deploy Stack
                  </Button>
                </form>
              ) : (
                <div className="p-4 rounded-xl bg-surface border border-accent/40 text-primary">
                  <div className="text-sm font-semibold font-mono text-accent mb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Deployment Spec Dispatched
                  </div>
                  <div className="text-xs text-secondary font-mono">
                    Engineering architecture dossier sent to <strong>{email}</strong>. Lead architect will respond within 24h.
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="text-center text-xs font-mono text-secondary">
            Enterprise Grade · HIPAA & SOC2 Compliant Topologies · Zero Lock-In
          </div>
        </div>
      </div>
    </section>
  );
};
