import React from 'react';

export const Statement: React.FC = () => {
  return (
    <section id="statement" className="py-20 md:py-28 bg-surface border-t border-border relative overflow-hidden">
      {/* Background Subtle Tech Grid */}
      <div className="absolute inset-0 bg-tech-grid opacity-25 pointer-events-none" />

      <div className="relative max-w-container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-subtle border border-accent/30 text-xs font-mono uppercase tracking-wider text-accent font-semibold shadow-subtle">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Non-Destructive Architecture
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-primary leading-tight">
              Complex problems. <br className="hidden sm:inline" />
              Simpler building.
            </h2>

            <p className="text-lg font-medium text-primary">
              You already have battle-tested systems. We engineer directly around and on top of them.
            </p>

            <p className="text-base text-secondary leading-relaxed">
              We never demand high-risk "rip and replace" migrations. Instead, our shared engineering foundation bolts modular, verified capability plates directly onto your existing servers, VPCs, and compliance frameworks via standard datum pins.
            </p>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-white border border-border shadow-subtle hover:border-accent/40 transition-colors">
                <div className="font-semibold text-sm text-primary mb-1 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Standardized Chassis
                </div>
                <div className="text-xs text-secondary leading-relaxed">
                  Preserve your existing hardware, on-prem clusters, and clinical repositories without disruption.
                </div>
              </div>
              <div className="p-4 rounded-xl bg-white border border-border shadow-subtle hover:border-accent/40 transition-colors">
                <div className="font-semibold text-sm text-primary mb-1 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Decoupled Upgrades
                </div>
                <div className="text-xs text-secondary leading-relaxed">
                  Upgrade or swap model intelligence and sync layers without refactoring front-end customer apps.
                </div>
              </div>
            </div>
          </div>

          {/* Right: Custom Isometric Modular Architecture SVG in Architectural Blueprint Aesthetic */}
          <div className="lg:col-span-6">
            <div className="relative rounded-2xl bg-white border border-border p-6 shadow-card flex flex-col items-center">
              <svg
                viewBox="0 0 540 380"
                className="w-full h-auto max-w-[500px]"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Background Grid Pattern */}
                <defs>
                  <pattern id="gridLight" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#E5E2DC" strokeWidth="0.8" strokeDasharray="2 2" />
                  </pattern>
                </defs>
                <rect width="540" height="380" fill="url(#gridLight)" opacity="0.9" rx="8" />

                {/* Isometric Layer 8: Experience (Top Plate) */}
                <g transform="translate(140, 50)">
                  {/* Top face */}
                  <polygon points="130,0 260,65 130,130 0,65" fill="#E8E5DF" stroke="#C5C1B8" strokeWidth="1.2" />
                  {/* Front left */}
                  <polygon points="0,65 130,130 130,145 0,80" fill="#D2CEC6" stroke="#C5C1B8" strokeWidth="1.2" />
                  {/* Front right */}
                  <polygon points="130,130 260,65 260,80 130,145" fill="#DBD7CF" stroke="#C5C1B8" strokeWidth="1.2" />
                  <text x="130" y="70" textAnchor="middle" fill="#0E1013" fontSize="11" fontFamily="'JetBrains Mono', monospace" fontWeight="600">
                    08 EXPERIENCE SURFACES
                  </text>
                </g>

                {/* Isometric Layer 4: Intelligence (Orange Hero Layer) */}
                <g transform="translate(140, 120)">
                  {/* Top face */}
                  <polygon points="130,0 260,65 130,130 0,65" fill="#F26A1B" stroke="#D3550F" strokeWidth="1.2" />
                  {/* Front left */}
                  <polygon points="0,65 130,130 130,145 0,80" fill="#D05611" stroke="#D3550F" strokeWidth="1.2" />
                  {/* Front right */}
                  <polygon points="130,130 260,65 260,80 130,145" fill="#E05E13" stroke="#D3550F" strokeWidth="1.2" />
                  <text x="130" y="70" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontFamily="'JetBrains Mono', monospace" fontWeight="700">
                    04 MODULAR INTELLIGENCE
                  </text>
                </g>

                {/* Isometric Layer 1: Existing Base Chassis (Approved Graphite Base) */}
                <g transform="translate(140, 200)">
                  {/* Top face */}
                  <polygon points="130,0 260,65 130,130 0,65" fill="#35393C" stroke="#25282A" strokeWidth="1.5" />
                  {/* Front left */}
                  <polygon points="0,65 130,130 130,165 0,100" fill="#282C2E" stroke="#25282A" strokeWidth="1.5" />
                  {/* Front right */}
                  <polygon points="130,130 260,65 260,100 130,165" fill="#2E3234" stroke="#25282A" strokeWidth="1.5" />
                  
                  {/* Mounting Datum Inset Holes */}
                  <ellipse cx="40" cy="65" rx="6" ry="3" fill="#1C1E20" />
                  <ellipse cx="220" cy="65" rx="6" ry="3" fill="#1C1E20" />
                  <ellipse cx="130" cy="20" rx="6" ry="3" fill="#1C1E20" />
                  <ellipse cx="130" cy="110" rx="6" ry="3" fill="#1C1E20" />

                  <text x="130" y="70" textAnchor="middle" fill="#FFFFFF" fontSize="11" fontFamily="'JetBrains Mono', monospace" fontWeight="600">
                    01 YOUR EXISTING SYSTEM
                  </text>
                  <text x="130" y="85" textAnchor="middle" fill="#A4AAB3" fontSize="9" fontFamily="'JetBrains Mono', monospace">
                    (Legacy VPC / On-Prem / Databases)
                  </text>
                </g>

                {/* Inter-layer Active Data Bus Pipeline */}
                <line x1="100" y1="120" x2="100" y2="300" stroke="#F26A1B" strokeWidth="2.5" strokeDasharray="4 3" className="animate-bus-dash" />
                <circle cx="100" cy="120" r="4" fill="#F26A1B" />
                <circle cx="100" cy="190" r="4" fill="#F26A1B" />
                <circle cx="100" cy="270" r="4" fill="#F26A1B" />

                {/* Blueprint Annotation Tags */}
                <g transform="translate(15, 180)">
                  <rect x="0" y="0" width="115" height="26" rx="5" fill="#FFFFFF" stroke="#F26A1B" strokeWidth="1" />
                  <text x="10" y="17" fill="#F26A1B" fontSize="9" fontFamily="'JetBrains Mono', monospace" fontWeight="700">
                    DATA BUS PIPELINE
                  </text>
                </g>

                <g transform="translate(410, 90)">
                  <rect x="0" y="0" width="115" height="26" rx="5" fill="#FFFFFF" stroke="#E5E2DC" strokeWidth="1" />
                  <text x="10" y="17" fill="#0E1013" fontSize="9" fontFamily="'JetBrains Mono', monospace" fontWeight="700">
                    ZERO REWRITE
                  </text>
                </g>
              </svg>

              <div className="w-full flex items-center justify-between pt-4 border-t border-border mt-2 text-xs text-secondary font-mono">
                <span>FOUNDATION TOPOLOGY</span>
                <span className="text-accent font-semibold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  100% NON-DESTRUCTIVE
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
