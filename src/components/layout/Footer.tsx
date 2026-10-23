import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    { label: 'Components', href: '#components' },
    { label: 'Case studies', href: '#case-studies' },
    { label: 'Builders', href: '#builders' },
    { label: 'Startups', href: '#startups' },
  ];

  return (
    <footer className="border-t border-border bg-surface py-12 md:py-16 text-sm">
      <div className="max-w-container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-border">
          {/* Engineering Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group"
            aria-label="Shared Engineering Foundation Home"
          >
            <div className="w-8 h-8 rounded-lg bg-white border border-border flex items-center justify-center text-accent shadow-subtle group-hover:border-accent transition-colors">
              <svg className="w-4 h-4 text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-mono font-bold tracking-wider text-primary uppercase leading-tight">
                SHARED<span className="text-accent">.ENGINE</span>
              </span>
              <span className="text-[9px] font-mono text-secondary tracking-widest leading-none">
                FOUNDATION OS
              </span>
            </div>
          </Link>

          {/* Links */}
          <div className="flex flex-wrap items-center gap-6 md:gap-8">
            {footerLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-secondary hover:text-primary transition-colors font-medium text-sm"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* Copyright notice */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-secondary">
          <p>© {currentYear} Shared Engine Foundation OS. All rights reserved.</p>
          <p className="text-secondary font-mono">Engineered for resilience and velocity · 100% Non-Destructive</p>
        </div>
      </div>
    </footer>
  );
};
