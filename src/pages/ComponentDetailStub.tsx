import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Nav } from '../components/layout/Nav';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/ui/Button';

export const ComponentDetailStub: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  return (
    <div className="min-h-screen flex flex-col bg-surface text-primary">
      <Nav />
      <main className="flex-1 max-w-container mx-auto px-6 pt-32 pb-20 w-full flex items-center justify-center">
        <div className="max-w-xl w-full bg-card border border-border rounded-2xl p-8 md:p-12 shadow-subtle text-center">
          <div className="w-12 h-12 rounded-xl bg-surface border border-border flex items-center justify-center mx-auto mb-6 text-accent">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <span className="text-xs uppercase font-mono tracking-wider text-secondary bg-surface px-3 py-1 rounded-full border border-border">
            Component Route
          </span>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary mt-4 mb-3">
            {slug ? slug.replace(/-/g, ' ') : 'Component Detail'}
          </h1>
          <p className="text-secondary text-sm leading-relaxed mb-8">
            This route (<code className="text-xs bg-surface px-2 py-1 rounded border border-border">/components/{slug}</code>) is stubbed per the contract. Technical documentation and API specifications will be displayed here.
          </p>
          <div className="flex justify-center">
            <Link to="/">
              <Button variant="secondary" size="md">
                ← Return to Home
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};
