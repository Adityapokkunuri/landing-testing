import React from 'react';
import { SHELF_ITEMS, type ShelfItem } from '../../content/shelf';
import { useComponentCycle } from '../../context/ComponentCycleContext';

export const SharedShelf: React.FC = () => {
  const { effectiveLayer, setActiveLayer, setHoveredLayer } = useComponentCycle();

  const renderIcon = (type: ShelfItem['icon']) => {
    switch (type) {
      case 'cube':
        return (
          <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        );
      case 'network':
        return (
          <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'database':
        return (
          <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
          </svg>
        );
      case 'shield':
        return (
          <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        );
      case 'puzzle':
        return (
          <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
          </svg>
        );
      case 'grid':
      default:
        return (
          <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        );
    }
  };

  return (
    <section id="shelf" className="py-20 md:py-28 bg-surface border-t border-border relative overflow-hidden">
      <div className="max-w-container mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div className="space-y-3 max-w-2xl">
            <div className="text-xs font-mono uppercase tracking-wider text-accent font-semibold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              Verified Component Repository
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-primary">
              The Shared Shelf
            </h2>
            <p className="text-secondary text-base leading-relaxed">
              Drop-in foundational modules engineered to interlock directly onto your existing hardware and data layers.
            </p>
          </div>

          <div className="text-xs font-mono text-secondary px-3.5 py-1.5 rounded-full bg-white border border-border shadow-subtle">
            <span>6 Modules Available</span>
          </div>
        </div>

        {/* 3x2 Grid of Components */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SHELF_ITEMS.map((item) => {
            const isActive = item.plateId === effectiveLayer;

            return (
              <div
                key={item.id}
                onClick={() => setActiveLayer(item.plateId)}
                onMouseEnter={() => setHoveredLayer(item.plateId)}
                onMouseLeave={() => setHoveredLayer(null)}
                className={`group p-6 rounded-2xl bg-white border transition-all duration-300 flex flex-col justify-between cursor-pointer relative overflow-hidden ${
                  isActive
                    ? 'border-accent shadow-card ring-1 ring-accent/30 scale-[1.02]'
                    : 'border-border shadow-subtle hover:border-accent/50 hover:shadow-card'
                }`}
              >
                {/* Active Indicator Top Border */}
                {isActive && (
                  <div className="absolute top-0 left-0 right-0 h-1 bg-accent" />
                )}

                <div>
                  {/* Header with Icon, Badge, and Plate ID */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-surface border border-border flex items-center justify-center group-hover:scale-105 transition-transform shadow-subtle">
                      {renderIcon(item.icon)}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-surface border border-border text-accent font-semibold">
                        PLATE 0{item.plateId}
                      </span>
                      <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-surface border border-border text-secondary">
                        {item.badge}
                      </span>
                    </div>
                  </div>

                  {/* Component Render Thumbnail (Changes with and showcases physical part) */}
                  <div className="relative aspect-[16/9] w-full rounded-xl bg-surface border border-border/80 p-2 mb-4 flex items-center justify-center overflow-hidden">
                    <img
                      src={`/layers/plate-${item.plateId}.png`}
                      alt={item.title}
                      className="w-full h-full object-contain transition-all duration-300 group-hover:scale-110"
                    />
                    {isActive && (
                      <span className="absolute bottom-1 right-1 text-[9px] font-mono px-1.5 py-0.5 rounded bg-accent text-white font-semibold animate-pulse">
                        3D ACTIVE
                      </span>
                    )}
                  </div>

                  {/* Category & Title */}
                  <div className="text-[11px] font-mono uppercase tracking-wider text-accent font-medium mb-1">
                    {item.category}
                  </div>
                  <h3 className="text-lg font-bold tracking-tight text-primary mb-2 group-hover:text-accent transition-colors">
                    {item.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-secondary leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Spec Link */}
                <div className="pt-5 mt-4 border-t border-border flex items-center justify-between text-xs font-mono text-secondary group-hover:text-primary transition-colors">
                  <span>Inspect Hardware Spec</span>
                  <span className="group-hover:translate-x-1 transition-transform text-accent">→</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
