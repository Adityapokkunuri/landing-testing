# Landing Page — Implementation Plan

> **Stack**: React + Vite + TypeScript · Tailwind CSS · GSAP + ScrollTrigger · React Router  
> **Approach**: Build in 5 reviewed stages (A → E). Stop after each for a screenshot review.

---

## Repository Layout (final target)

```
shared/
├── public/
│   └── layers/           # plate-1.png … plate-8.png (drop-in later)
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Nav.tsx
│   │   │   └── Footer.tsx
│   │   ├── sections/
│   │   │   ├── Hero.tsx
│   │   │   ├── ProofStrip.tsx
│   │   │   ├── Statement.tsx
│   │   │   ├── StickyScroll.tsx
│   │   │   ├── ModelSwap.tsx
│   │   │   ├── SharedShelf.tsx
│   │   │   ├── CaseStudies.tsx
│   │   │   ├── Builders.tsx
│   │   │   └── CTABand.tsx
│   │   ├── ui/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── SectionShell.tsx
│   │   └── StackVisual/
│   │       ├── index.tsx          # public API + mode router
│   │       ├── Assembled.tsx
│   │       ├── Exploded.tsx
│   │       └── Swap.tsx
│   ├── content/
│   │   ├── stats.ts               # TODO: confirm numbers
│   │   ├── steps.ts               # 6 sticky-scroll steps
│   │   ├── shelf.ts               # shared shelf cards
│   │   ├── caseStudies.ts
│   │   └── builders.ts
│   ├── hooks/
│   │   └── useReducedMotion.ts
│   ├── styles/
│   │   └── index.css              # Tailwind base + custom tokens
│   ├── App.tsx
│   └── main.tsx
├── tailwind.config.ts
├── vite.config.ts
└── README.md
```

---

## Design Tokens (Tailwind `theme.extend`)

| Token | Value | Usage |
|---|---|---|
| `bg-surface` | `#F6F6F4` | Page background |
| `bg-white` | `#FFFFFF` | Card / panel surfaces |
| `border-subtle` | `#E5E5E2` | All 1px borders |
| `text-primary` | `#111111` | Headlines, body |
| `text-secondary` | `#5C5C58` | Labels, captions |
| `accent` | `#F26A1B` | Orange — buttons, active layer glow |
| `font-sans` | `Inter` | All text |

Grid: `max-w-[1200px] mx-auto px-6`, 12-col Tailwind grid.

---

## Stage A — Project scaffold, design system, Nav, Footer, empty shells

**Goal**: Working dev server, no placeholder text, all sections visible as grey shells with correct spacing.

### Steps
1. `npm create vite@latest . -- --template react-ts`
2. Install: `tailwindcss`, `gsap`, `react-router-dom`, `@fontsource/inter`
3. `tailwind.config.ts` — extend theme with all tokens above
4. `src/styles/index.css` — import Inter, set base resets, CSS custom properties
5. **Nav** — logo `[LOGO]`, 4 links, orange "Talk to us" CTA; sticky with `backdrop-blur` on scroll (IntersectionObserver on a sentinel div)
6. **Footer** — logo, 4 links, `© [YEAR] [Company name placeholder]`
7. **App.tsx** — React Router `<Routes>`: `/` = `<HomePage>`, `/components/:slug` = stub
8. **HomePage** — import all section shells (each just a `<section>` with `id`, min-height, a centred label showing the section name)
9. Screenshot checkpoint ✅

### Deliverables
- `tailwind.config.ts`, `src/styles/index.css`
- `Nav.tsx`, `Footer.tsx`
- `App.tsx` with router
- 9 empty `SectionShell` components (one per section)

---

## Stage B — Sections 1–4 with real copy + SVG diagram

**Goal**: Hero, Proof Strip, Statement rendered with final copy; no animations yet.

### Steps
1. **`src/content/stats.ts`** — export the three proof numbers with `// TODO: confirm` comments
2. **Hero** (`Section 2`)
   - Left: headline, subhead, two buttons
   - Right: `<StackVisual mode="assembled" />` — renders grey placeholder plates for now
   - 12-col split: `col-span-6` each on desktop, stacked on mobile
3. **Proof Strip** (`Section 3`)
   - Three `<stat>` blocks: large number + label
   - Source: `stats.ts` only — no number appears anywhere else on the page
4. **Statement** (`Section 4`)
   - Left: eyebrow, headline, body copy
   - Right: inline SVG diagram
     - Grey rectangle: "Your existing system"
     - 3 coloured accent pieces clipped around it (drawn in `<svg>` with `<rect>`, `<text>`, no images)
5. Screenshot checkpoint ✅

### Deliverables
- `src/content/stats.ts`
- `Hero.tsx`, `ProofStrip.tsx`, `Statement.tsx`
- SVG diagram (inline in `Statement.tsx`)

---

## Stage C — `<StackVisual>` + Sections 5–6 with scroll animation

**Goal**: Pinned sticky-scroll working on desktop; mobile fallback card list.

### Steps
1. **`StackVisual` component** (complete contract implementation)
   - 8 plates, 3:2 aspect ratio; reads `/public/layers/plate-N.png`; falls back to grey placeholder `<div>` with plate number + name if image 404s
   - `mode="assembled"`: stacked, CSS `@keyframes float` idle animation (paused if `prefers-reduced-motion`)
   - `mode="exploded"`: plates spread vertically by `progress` (0→1); `activeLayer` gets orange CSS `drop-shadow`
   - `mode="swap"`: `activeLayer=4` slides out right; replacement slides in from right; label "Version A → Version B"
   - All animation via GSAP; `useReducedMotion` hook gates every GSAP tween
2. **Sticky Scroll** (`Section 5`)
   - Desktop: `position: sticky` left panel (`<StackVisual mode="exploded">`); right copy panel scrolls through 6 steps; GSAP `ScrollTrigger` scrub drives `progress` prop and `activeLayer`
   - Mobile (`<768px`): un-pin, render 6 vertical `<StepCard>` components
   - Copy from `src/content/steps.ts` (6 step objects with `plate`, `title`, `body`, `otherwise`, `slug`)
   - "Shared shelf" column visible on desktop, hidden on mobile
3. **Model Swap** (`Section 6`)
   - `<StackVisual mode="swap" activeLayer={4} />` left
   - Right: animated box "Version A → Version B" (CSS transition, GSAP on scroll enter)
4. Screenshot checkpoint ✅

### Deliverables
- `src/components/StackVisual/` (all 4 files)
- `src/hooks/useReducedMotion.ts`
- `src/content/steps.ts`
- `StickyScroll.tsx`, `ModelSwap.tsx`

---

## Stage D — Sections 7–10 + responsive pass

**Goal**: All sections built; full responsive layout verified.

### Steps
1. **Shared Shelf** (`Section 7`) — 3×2 grid, 6 cards from `src/content/shelf.ts`; each card: line icon (inline SVG), title, one-line desc; "Browse all" link
2. **Case Studies** (`Section 8`) — 3 large cards from `src/content/caseStudies.ts`; each card has clearly commented field placeholders: `// title`, `// audience`, `// aiCapability`, `// outcome`, `// imageAlt`; lazy-loaded image placeholder; "See more" quiet link
3. **Builders** (`Section 9`) — horizontal scroll timeline; 4 nodes (1 larger `Mentor`, 3 smaller); data from `src/content/builders.ts`; CSS `overflow-x: auto`, snap scroll on mobile
4. **CTA Band** (`Section 10`) — centred headline, orange "Talk to us" button
5. **Responsive pass** — audit every section at 375px, 768px, 1200px; fix grid collapses, font sizes, spacing
6. Screenshot checkpoint ✅

### Deliverables
- `src/content/shelf.ts`, `caseStudies.ts`, `builders.ts`
- `SharedShelf.tsx`, `CaseStudies.tsx`, `Builders.tsx`, `CTABand.tsx`

---

## Stage E — Accessibility, performance, README

**Goal**: Lighthouse ≥ 90 on Performance, 100 on Accessibility.

### Steps
1. **A11y audit**
   - Semantic landmarks: `<header>`, `<nav>`, `<main>`, `<footer>`, `<section aria-labelledby>`
   - All interactive elements: visible `:focus-visible` ring (2px orange, 2px offset)
   - Alt text on all images / SVGs; decorative SVGs get `aria-hidden`
   - Colour contrast check — all text vs background ≥ AA
   - Keyboard: Tab order through Nav, Hero buttons, Sticky scroll steps, CTA
2. **Performance**
   - `<img loading="lazy" decoding="async">` on all images
   - Fonts: `font-display: swap`; preload Inter subsets
   - GSAP: import only `gsap/dist/gsap` + `ScrollTrigger` (no full bundle)
   - Verify no layout shift (set explicit width/height or aspect-ratio on all media)
   - Vite build: check chunk sizes, split vendor chunk
3. **README** — section "How to add plate PNGs": exact filenames, canvas size spec, how `StackVisual` loads them, what to do if a file is missing
4. Final screenshot checkpoint ✅

---

## Key Contracts & Rules

| Rule | Detail |
|---|---|
| Numbers | Only appear in `stats.ts`; only rendered in Proof Strip |
| Copy | All editable text lives in `src/content/*.ts` |
| Plate images | `/public/layers/plate-{1-8}.png`, same canvas size, drop-in |
| `StackVisual` props | `mode`, `activeLayer`, `progress` — do not change these names |
| Orange | Only: primary buttons, active layer glow, SVG accent pieces |
| Animations | Always gated by `useReducedMotion()` |
| No dark mode | `color-scheme: light` set on `<html>` |
| Routes | `/` and `/components/:slug` (stub, no 404) |

---

## Ready to start?

Reply **"go"** (or just confirm) and I'll execute **Stage A** immediately:  
scaffold the Vite project, wire up Tailwind with the design tokens, build Nav + Footer, and mount all empty section shells.
