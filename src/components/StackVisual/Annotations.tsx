import React from 'react';

export interface AnnotationItem {
  layerId: number;
  label: string;
  role: string;
  material: string;
  topPercent: number; // percentage from top in exploded view
  side: 'left' | 'right';
  isAccent?: boolean;
}

export const STACK_ANNOTATIONS: AnnotationItem[] = [
  { layerId: 8, label: '08 Experience', role: 'Accessible Scaffolds & UI Canvas', material: 'Warm Silver', topPercent: 12, side: 'right' },
  { layerId: 7, label: '07 Applications', role: 'Domain Micro-Frontends', material: 'Satin Titanium', topPercent: 22, side: 'left' },
  { layerId: 6, label: '06 Reliability & Sync', role: 'Offline Mesh & Distributed Sourcing', material: 'Dark Titanium', topPercent: 33, side: 'right' },
  { layerId: 5, label: '05 Decisions', role: 'Deterministic Policy Logic', material: 'Satin Titanium', topPercent: 44, side: 'left' },
  { layerId: 4, label: '04 Intelligence', role: 'Hot-Swappable AI Gateway', material: 'Signal Orange', topPercent: 55, side: 'right', isAccent: true },
  { layerId: 3, label: '03 Access & Security', role: 'Zero-Trust Perimeter & RBAC', material: 'Dark Titanium', topPercent: 66, side: 'left' },
  { layerId: 2, label: '02 Data Ingestion', role: 'Streaming ETL & Schema Registry', material: 'Satin Titanium', topPercent: 77, side: 'right' },
  { layerId: 1, label: '01 Existing System', role: 'Hardware & Legacy Server Anchor', material: 'Base Graphite', topPercent: 88, side: 'left' },
];

interface AnnotationsProps {
  activeLayer?: number;
  onSelectLayer?: (id: number) => void;
  visible?: boolean;
}

export const Annotations: React.FC<AnnotationsProps> = ({
  activeLayer = 4,
  onSelectLayer,
  visible = true,
}) => {
  if (!visible) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
      {STACK_ANNOTATIONS.map((anno) => {
        const isActive = anno.layerId === activeLayer;
        const isLeft = anno.side === 'left';

        return (
          <div
            key={anno.layerId}
            style={{ top: `${anno.topPercent}%` }}
            className={`absolute flex items-center gap-2 pointer-events-auto cursor-pointer transition-all duration-300 ${
              isLeft ? 'left-3 sm:left-6 flex-row' : 'right-3 sm:right-6 flex-row-reverse'
            } ${isActive ? 'scale-105 z-20' : 'opacity-60 hover:opacity-100 z-10'}`}
            onClick={() => onSelectLayer && onSelectLayer(anno.layerId)}
          >
            {/* Indicator Dot */}
            <div
              className={`w-2.5 h-2.5 rounded-full border transition-all duration-300 ${
                anno.isAccent
                  ? 'bg-accent border-accent shadow-sm'
                  : isActive
                  ? 'bg-primary border-primary ring-2 ring-primary/20'
                  : 'bg-card border-border'
              }`}
            />

            {/* Connecting subtle line */}
            <div
              className={`hidden md:block h-px w-6 sm:w-10 transition-colors duration-300 ${
                isActive ? (anno.isAccent ? 'bg-accent' : 'bg-primary') : 'bg-border'
              }`}
            />

            {/* Callout Pill */}
            <div
              className={`px-2.5 py-1 rounded-md text-xs font-mono backdrop-blur-md border transition-all duration-300 ${
                isActive
                  ? anno.isAccent
                    ? 'bg-accent/15 border-accent text-accent font-semibold shadow-subtle'
                    : 'bg-card/95 border-primary text-primary font-semibold shadow-subtle'
                  : 'bg-card/80 border-border/70 text-secondary'
              }`}
            >
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <span>{anno.label}</span>
                {anno.isAccent && (
                  <span className="text-[10px] px-1 py-0.2 bg-accent text-white rounded font-sans uppercase">
                    AI
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
