import React from 'react';

interface SectionShellProps {
  id: string;
  number: number;
  title: string;
  description: string;
  minHeight?: string;
  children?: React.ReactNode;
}

export const SectionShell: React.FC<SectionShellProps> = ({
  id,
  number,
  title,
  description,
  minHeight = 'min-h-[220px]',
  children,
}) => {
  return (
    <section
      id={id}
      className="py-12 md:py-16 border-b border-border/60 scroll-mt-20"
      aria-labelledby={`heading-section-${number}`}
    >
      <div className="max-w-container mx-auto px-6">
        <div
          className={`w-full rounded-2xl bg-card border border-border p-8 md:p-12 shadow-subtle flex flex-col justify-between ${minHeight}`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/50">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-surface border border-border text-xs font-semibold text-secondary">
                {number}
              </span>
              <h2
                id={`heading-section-${number}`}
                className="text-lg md:text-xl font-semibold text-primary tracking-tight"
              >
                {title}
              </h2>
            </div>
            <span className="text-xs uppercase tracking-wider font-mono text-secondary bg-surface px-2.5 py-1 rounded border border-border/60 self-start sm:self-auto">
              Stage Shell: #{id}
            </span>
          </div>

          <div className="py-6 flex-1 flex flex-col justify-center">
            {children ? (
              children
            ) : (
              <div className="rounded-xl border border-dashed border-border p-6 bg-surface/50 text-center">
                <p className="text-sm font-medium text-secondary">{description}</p>
                <p className="text-xs text-secondary/60 mt-1 font-mono">
                  Target implementation ready for subsequent stage
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
