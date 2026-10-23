import React from 'react';
import { Nav } from '../components/layout/Nav';
import { Footer } from '../components/layout/Footer';
import { Hero } from '../components/sections/Hero';
import { ProofStrip } from '../components/sections/ProofStrip';
import { Statement } from '../components/sections/Statement';
import { ModelSwap } from '../components/sections/ModelSwap';
import { CaseStudies } from '../components/sections/CaseStudies';
import { Builders } from '../components/sections/Builders';
import { CTABand } from '../components/sections/CTABand';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-primary antialiased selection:bg-accent/20 selection:text-accent">
      {/* Section 1: Navigation Header */}
      <Nav />

      {/* Main Sections */}
      <main className="flex-1 pt-16">
        {/* Section 2: Hero with 3D Assembled Stack */}
        <Hero />

        {/* Section 3: Verified Proof Metrics */}
        <ProofStrip />

        {/* Section 4: Architectural Statement with Isometric Modular Diagram */}
        <Statement />

        {/* Section 6: Dynamic Model Hot-Swap Demonstration */}
        <ModelSwap />

        {/* Section 7: Case Studies & Production Deployments */}
        <CaseStudies />

        {/* Section 9: Engineering Guild Timeline */}
        <Builders />

        {/* Section 10: Direct CTA Band */}
        <CTABand />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
