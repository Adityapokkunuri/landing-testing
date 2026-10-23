import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export const Nav: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Components', href: '#components' },
    { label: 'Case studies', href: '#case-studies' },
    { label: 'Builders', href: '#builders' },
    { label: 'Startups', href: '#startups' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-surface/90 backdrop-blur-md border-b border-border py-3 shadow-subtle'
          : 'bg-surface/60 backdrop-blur-sm border-b border-transparent py-5'
      }`}
    >
      <div className="max-w-container mx-auto px-6">
        <nav className="flex items-center justify-between" aria-label="Main Navigation">
          {/* Engineering Brand Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group focus-visible:rounded"
            aria-label="Shared Engineering Foundation Home"
          >
            <div className="w-8 h-8 rounded-lg bg-white border border-border flex items-center justify-center text-accent group-hover:border-accent group-hover:shadow-glow transition-all duration-300 shadow-subtle">
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

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-sm">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-secondary hover:text-primary transition-colors font-medium text-sm tracking-tight focus-visible:rounded px-1 py-0.5"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              asAnchor
              href="#contact"
              className="text-sm font-medium shadow-subtle"
            >
              Talk to us
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-secondary hover:text-primary hover:bg-white border border-border transition-colors"
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle navigation menu"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </nav>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-3 border border-border mt-3 space-y-3 bg-white/95 backdrop-blur-md rounded-2xl px-3 shadow-card">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-secondary hover:text-primary hover:bg-surface rounded-lg transition-colors"
              >
                {link.label}
              </a>
            ))}
            <div className="pt-2">
              <Button
                variant="primary"
                size="md"
                asAnchor
                href="#contact"
                className="w-full justify-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Talk to us
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
