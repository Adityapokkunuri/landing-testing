# Enterprise Foundation OS — Complete Landing Page Architecture & System Documentation

> **Document Version**: 2.4.0  
> **Audience**: Engineering Team, System Architects, Technical Product Managers, and New Joinees  
> **Repository**: `Ottobon-INC/SharedEngineering-LandingPage`  
> **Target Application**: Enterprise Foundation OS — Decoupled Architecture Explorer  
> **Live Local Dev URL**: `http://localhost:5173`

---

## 📑 Table of Contents

1. [Executive Summary & Product Narrative](#1-executive-summary--product-narrative)
2. [High-Level Architecture & Technical Stack](#2-high-level-architecture--technical-stack)
3. [Repository Structure & Codebase Anatomy](#3-repository-structure--codebase-anatomy)
4. [Design System, Typography & Aesthetic Tokens](#4-design-system-typography--aesthetic-tokens)
5. [Complete Visual & Narrative Walkthrough (Section-by-Section)](#5-complete-visual--narrative-walkthrough-section-by-section)
   - [5.1 Navigation Bar (`Nav.tsx`)](#51-navigation-bar-navtsx)
   - [5.2 Editorial Hero Header (`Hero.tsx`)](#52-editorial-hero-header-herotsx)
   - [5.3 Pinned 3D Decoupled Architecture Explorer (`Hero.tsx` + `ThreeViewer.tsx`)](#53-pinned-3d-decoupled-architecture-explorer-herotsx--threeviewertsx)
   - [5.4 Deep-Dive: The 8 Decoupled Foundation Layers](#54-deep-dive-the-8-decoupled-foundation-layers)
   - [5.5 Verified Live Telemetry Strip (`ProofStrip.tsx`)](#55-verified-live-telemetry-strip-proofstriptsx)
   - [5.6 Non-Destructive Architectural Statement & Isometric Blueprint (`Statement.tsx`)](#56-non-destructive-architectural-statement--isometric-blueprint-statementtsx)
   - [5.7 Universal Dynamic Modular Hot-Swap Console (`ModelSwap.tsx`)](#57-universal-dynamic-modular-hot-swap-console-modelswapsx)
   - [5.8 Case Studies & Production Deployments (`CaseStudies.tsx`)](#58-case-studies--production-deployments-casestudiestsx)
   - [5.9 Engineering Guild Timeline (`Builders.tsx`)](#59-engineering-guild-timeline-builderstsx)
   - [5.10 Direct Deployment Console & Inquiry Terminal (`CTABand.tsx`)](#510-direct-deployment-console--inquiry-terminal-ctabandtsx)
   - [5.11 Engineering Footer (`Footer.tsx`)](#511-engineering-footer-footertsx)
   - [5.12 Deep Routing & Detail Stubs (`ComponentDetailStub.tsx`)](#512-deep-routing--detail-stubs-componentdetailstubtsx)
6. [3D WebGL Graphics Engine Deep Dive (`ThreeViewer.tsx`)](#6-3d-webgl-graphics-engine-deep-dive-threeviewertsx)
7. [Procedural 3D Blender Asset Pipeline (`tools/blender/`)](#7-procedural-3d-blender-asset-pipeline-toolsblender)
8. [Developer Onboarding & Step-by-Step Refinement Guide](#8-developer-onboarding--step-by-step-refinement-guide)
9. [Future Roadmap & Engineering Backlog](#9-future-roadmap--engineering-backlog)

---

## 1. Executive Summary & Product Narrative

### 1.1 The Core Problem
Enterprise software engineering teams repeatedly waste months (and millions of dollars) solving redundant foundational infrastructure:
- Writing multi-cloud POSIX datum layers.
- Building bespoke Kafka/streaming pipelines that crash during surge loads.
- Passing rigorous SOC2, HIPAA, and ISO-27001 zero-trust identity reviews.
- Integrating rapidly changing frontier AI models without breaking client contracts.
- Building distributed offline synchronization meshes.

When an enterprise product squad builds all these layers from scratch, **less than 15% of their engineering velocity goes toward the proprietary features that actually make their business unique**.

### 1.2 The Core Solution: Enterprise Foundation OS
The **Enterprise Foundation OS** (`SHARED.ENGINE`) is an ultra-reliable, decoupled 8-layer foundation engine. It provides:
1. **Universal Infrastructure Datum** (Base chassis running anywhere: Bare-Metal, AWS, GCP, Azure, or Sovereign Enclaves).
2. **Zero-Loss Streaming Ingestion Bus** (Handling 4.8M+ msg/sec).
3. **Zero-Trust Identity Perimeter** (Pre-certified SAML/OIDC/mTLS passing Fortune 500 audits on day one).
4. **Frontier AI Neural Core** (Hot-swappable model gateway: Claude, GPT, Gemini, Llama).
5. **Deterministic Decision Hub** (WASM-based policy rules decoupled from production code).
6. **Distributed Reliability Mesh** (RPO=0 state synchronization and active-active multi-region failover).
7. **Modular Capability Engine** (Sandboxed application cartridges for independent squad delivery).
8. **Presentation Glass Interface** (Coherent, tokenized micro-frontend accessibility design system).

### 1.3 The Visual & Metaphorical Identity
The landing page translates this complex systems engineering achievement into a visceral physical metaphor:
- **Physical Machined Hardware Stack**: Software layers are rendered as precision-machined titanium, graphite, and optical dielectric plates with physical mounting pins and datum coordinates.
- **The "Sealed Monolith" Entry**: Enterprise customers initially see a unified, sleek black server monolith labeled **`"YOUR CORE PRODUCT"`**.
- **Scroll-Driven Mechanical Unpack**: As the visitor scrolls down, the outer casing splits along a glowing Leica-orange laser horizon seam, lifts upward and downward, and dissolves. The 8 internal plates slide laterally to the left while expanding vertically along the Y-axis.
- **Click-to-Expand Engineering Dossiers**: Physical dotted leader lines connect each 3D plate to an inspection rack on the right, opening verified Enterprise Protocol Contracts and Founder ROI calculations.
- **100% Non-Destructive**: The core philosophy emphasized throughout the copy is **"We never demand rip-and-replace."** The foundation bolts directly onto existing databases, VPCs, and legacy clusters.

---

## 2. High-Level Architecture & Technical Stack

```
                                    +-----------------------------------------------+
                                    |               React 19 + TypeScript           |
                                    |        (Vite 8, Tailwind CSS, Oxlint)         |
                                    +-----------------------+-----------------------+
                                                            |
                     +--------------------------------------+--------------------------------------+
                     |                                      |                                      |
       +-------------v-------------+          +-------------v-------------+          +-------------v-------------+
       |   Presentation & UI Shell |          |     Global Context & State|          |  3D WebGL Graphics Engine |
       |                           |          |                           |          |                           |
       | - Nav & Footer            |          | - ComponentCycleContext   |          | - Three.js WebGLRenderer  |
       | - Hero (Header & Grid)    |          |   * activeLayer           |          | - OrbitControls (360 drag)|
       | - ProofStrip Metrics      |          |   * hoveredLayer          |          | - GLTFLoader Singleton    |
       | - Statement (SVG diagram) |          |   * effectiveLayer        |          | - Dynamic Lighting & PBR  |
       | - ModelSwap (Rack ctrl)   |          +-------------+-------------+          | - GSAP Scrub & Tweens     |
       | - Case Studies & Builders |                        |                        +-------------+-------------+
       | - CTABand (CLI Terminal)  |                        |                                      |
       +---------------------------+                        +--------------------------------------+
                                                            |
                                              +-------------v-------------+
                                              | 3D Procedural Assets      |
                                              | (Blender Python Pipeline) |
                                              | - 8 Individual Plates     |
                                              | - Unified Assembly GLB    |
                                              +---------------------------+
```

### Detailed Dependencies:
| Category | Technology | Version | Purpose |
|---|---|---|---|
| **Core Framework** | React | `^19.3.1` | UI rendering tree, hooks, and component lifecycle |
| **Language** | TypeScript | `~6.0.3` | Strict type safety across contracts, specs, and state |
| **Routing** | React Router DOM | `^7.18.4` | Single-page client navigation (`/` and `/components/:slug`) |
| **3D Engine** | Three.js | `^0.186.1` | WebGL canvas, lighting rigs, GLB mesh management, Raycasting |
| **Animation Core** | GSAP + ScrollTrigger | `^3.15.0` | Scroll-driven pinned scrub, spring easings, position tweens |
| **Styling** | Tailwind CSS | `^3.4.19` | Design token system, responsive utility grid |
| **Typography** | Fontsource Inter & JetBrains Mono | `^5.3.0` | Self-hosted precision fonts (system-ui & monospace) |
| **Build Tool** | Vite | `^8.3.4` | Ultra-fast HMR and bundle compilation |
| **Linter** | Oxlint | `^1.88.0` | High-performance Rust-based static code analyzer |
| **3D Modeling** | Blender Python API (`bpy`) | `5.2.3 LTS` | Parametric procedural generation of GLB plates & assembly |

---

## 3. Repository Structure & Codebase Anatomy

```
shared/
├── public/
│   ├── models/foundation/               # Compiled 3D GLB assets
│   │   ├── plate-01-existing-system.glb # Base graphite datum anchor
│   │   ├── plate-02-data-in.glb         # Streaming bus manifold
│   │   ├── plate-03-access-security.glb # Zero-trust perimeter ring
│   │   ├── plate-04-intelligence.glb    # Hex-pattern neural die
│   │   ├── plate-05-decisions.glb       # Routing policy gate
│   │   ├── plate-06-reliability-sync.glb# Optical sync coupler spine
│   │   ├── plate-07-applications.glb    # Slide-in cartridge bay
│   │   ├── plate-08-experience.glb      # Beveled glass presentation face
│   │   └── shared-foundation-assembly.glb # Single unified 8-plate stack (524 KB)
│   ├── layers/                          # 2D preview renders & textures
│   └── renders/                         # Offline high-resolution fallback images
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Nav.tsx                  # Responsive header with blur & branding
│   │   │   └── Footer.tsx               # Architectural footer with spec notes
│   │   ├── sections/
│   │   │   ├── Hero.tsx                 # Central hero & 3D architecture explorer
│   │   │   ├── ProofStrip.tsx           # Verified telemetry metrics strip (50+, 30+, 10+)
│   │   │   ├── Statement.tsx            # Non-destructive thesis + custom isometric SVG
│   │   │   ├── ModelSwap.tsx            # Universal modular hot-swap console & bay
│   │   │   ├── CaseStudies.tsx          # 3 Real-world enterprise case studies
│   │   │   ├── Builders.tsx             # 4-node engineering guild timeline
│   │   │   ├── CTABand.tsx              # Interactive CLI terminal & deployment form
│   │   │   ├── StickyScroll.tsx         # Alternative multi-stage scroll controller
│   │   │   └── SharedShelf.tsx          # 6-card modular capability repository
│   │   ├── StackVisual/
│   │   │   ├── ThreeViewer.tsx          # High-performance Three.js WebGL canvas (1065 lines)
│   │   │   ├── layerSpecs.ts            # Mathematical Y-offsets, camera targets, datum coords
│   │   │   ├── Annotations.tsx          # Floating 2D/3D leader lines and datum callouts
│   │   │   └── index.tsx                # Barrel export for StackVisual components
│   │   └── ui/
│   │       ├── Button.tsx               # Reusable button with primary/secondary/ghost variants
│   │       └── SectionShell.tsx         # Unified section wrapper with technical grid
│   ├── content/
│   │   ├── steps.ts                     # Full technical specs, contracts & founder ROI for 8 layers
│   │   ├── swapConfigs.ts               # Version A vs Version B configurations for all 8 layers
│   │   ├── builders.ts                  # Guild roles, tenures, focuses, and stewards
│   │   ├── caseStudies.ts               # Case study metrics, audiences, and mounted plates
│   │   ├── shelf.ts                     # Shelf repository metadata and badges
│   │   └── stats.ts                     # Production metrics (builds, hospitals, institutions)
│   ├── context/
│   │   └── ComponentCycleContext.tsx    # React Context for active/hovered layer state sync
│   ├── pages/
│   │   ├── HomePage.tsx                 # Single-page assembler combining all landing sections
│   │   └── ComponentDetailStub.tsx      # Deep link target for `/components/:slug`
│   ├── App.tsx                          # App root with Router and Context Provider
│   ├── index.css                        # Design tokens, keyframe animations, tech grid
│   └── main.tsx                         # React 19 DOM entrypoint
├── tools/blender/                       # Complete Python pipeline for procedural 3D modeling
│   ├── config.py                        # Layer specs, plate dimensions, material properties
│   ├── geometry.py                      # Boolean cuts, datum holes, beveling algorithms
│   ├── materials.py                     # Principled BSDF shader setup
│   ├── generate_plate.py                # Standalone single plate generator
│   ├── generate_assembly.py             # Full 8-layer stack assembler & GLB exporter
│   ├── rebuild_all_assets.py            # Headless automated rebuild script
│   └── validate.py                      # Tri-count, dimension, and GLTF compliance auditor
├── docs/                                # Technical docs and asset manifests
├── package.json                         # Project dependencies and npm scripts
├── tailwind.config.ts                   # Custom color tokens, fonts, and shadows
└── vite.config.ts                       # Vite bundler configuration
```

---

## 4. Design System, Typography & Aesthetic Tokens

The visual style is **Architectural Engineering Minimalist**: inspired by industrial design, aerospace blueprints, precision optical hardware (Leica/Braun), and high-reliability server racks.

### 4.1 Color Palette
| Token Name | Hex Code | Purpose / Application |
|---|---|---|
| `surface` | `#FAF9F5` | Primary page background; warm alabaster off-white |
| `surface-subtle` | `#F3F1EB` | Secondary container backgrounds, input fills, pill backgrounds |
| `card` | `#FFFFFF` | Elevated components, inspection dossiers, terminal card frames |
| `primary` | `#090A0D` | Primary typography, headers, high-contrast dark elements |
| `secondary` | `#4A505C` | Secondary technical copy, metadata, timestamps |
| `muted` | `#808794` | Placeholder text, subtle border accents |
| `border` | `#E5E2DC` | Structural container dividers, card borders, grid lines |
| `accent` | `#FF5500` | Signature Leica Orange: active layers, focus rings, glow highlights |
| `accent-subtle` | `#FFF4ED` | Warm orange tinted pill background |
| `emerald-500` | `#10B981` | Live uptime telemetry, active beacons, passed compliance tests |
| `sky-500` / `cyan` | `#0284C7` | Version B hot-swap highlights, streaming bus indicators |

### 4.2 Typography
- **Primary Body & Headings**: `Inter` (`@fontsource/inter` 400, 500, 600, 700)
  - Characterized by tight letter tracking (`tracking-tight`, `-0.025em`) for modern editorial hierarchy.
- **Technical & Telemetry Data**: `JetBrains Mono` (`@fontsource/jetbrains-mono` 400, 500, 700)
  - Used for all code blocks, layer codes (`08`, `STAGE 01`), protocol contracts, coordinates, and latency metrics.

### 4.3 Background Tech Grid
A custom repeating SVG grid pattern is injected across sections via CSS:
```css
.bg-tech-grid {
  background-image: 
    linear-gradient(to right, rgba(229, 226, 220, 0.45) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(229, 226, 220, 0.45) 1px, transparent 1px);
  background-size: 32px 32px;
}
```

---

## 5. Complete Visual & Narrative Walkthrough (Section-by-Section)

```
+-----------------------------------------------------------------------------------+
| SECTION 1: Fixed Navigation Bar (Nav.tsx)                                         |
+-----------------------------------------------------------------------------------+
| SECTION 2: Hero Editorial Header (Hero.tsx)                                       |
| - Operational Status Pill ("ENTERPRISE FOUNDATION OS | DECOUPLED ARCHITECTURE")    |
| - Headline: "Build faster on an engine that's already engineered."                |
| - Dual CTAs: [Talk to engineering]  [Explore 8-Layer Stack v]                     |
| - Live Production Metrics: [ 50+ Builds ] | [ 30+ Hospitals ] | [ 10+ Inst. ]     |
+-----------------------------------------------------------------------------------+
| SECTION 2 (CONT): Pinned 3D Architecture Explorer (Hero.tsx + ThreeViewer.tsx)    |
| Stage 01: "YOUR CORE PRODUCT" Monolith -> Opens & Dissolves                       |
| Stage 02: 8 Plates glide left & expand vertically along Y                         |
| Stage 03: Architecture Matrix Revealed -> Click-to-Expand Component Dossier       |
+-----------------------------------------------------------------------------------+
| SECTION 3: Verified Live Production Telemetry (ProofStrip.tsx)                    |
| - Uptime 99.998% | Rewrite Ratio 0.00% | Titanium Chassis Spec                    |
| - 3 Stat Cards: [50+ BUILDS]  [30+ HOSPITALS]  [10+ INSTITUTIONS]                 |
+-----------------------------------------------------------------------------------+
| SECTION 4: Architectural Statement & Isometric SVG Blueprint (Statement.tsx)      |
| - "Complex problems. Simpler building. Non-destructive bolt-on."                  |
| - Custom Blueprint SVG showing Layer 08, 04, 01 and inter-layer Data Bus         |
+-----------------------------------------------------------------------------------+
| SECTION 5: Universal Modular Hot-Swap Console (ModelSwap.tsx)                     |
| - Left: 3D Hardware Bay with whole assembly (20mm separation)                     |
| - Right: 8-Slot Selection Rack + Version A vs Version B Interactive Cards         |
| - Live Ejection (+X) -> Teleport -> Opposite Insertion (-X) -> Latch Flash        |
+-----------------------------------------------------------------------------------+
| SECTION 6: Verified Case Studies & Deployments (CaseStudies.tsx)                  |
| - [Healthcare: 30+ Hospitals]  [Fintech: 12M+ Audits]  [Genomics: 10+ Centers]    |
+-----------------------------------------------------------------------------------+
| SECTION 7: Engineering Guild Timeline (Builders.tsx)                              |
| - [Mentor: 10+ Yrs] -> [Architect: 5+ Yrs] -> [Sr Eng: 3+ Yrs] -> [Builder: <1Yr] |
+-----------------------------------------------------------------------------------+
| SECTION 8: Interactive CLI Deployment Console (CTABand.tsx)                       |
| - Terminal window executing `shared-foundation init --target=enterprise-vpc`      |
| - Live Email Submission Form -> "Deployment Spec Dispatched" confirmation         |
+-----------------------------------------------------------------------------------+
| SECTION 9: Architectural Footer (Footer.tsx)                                      |
+-----------------------------------------------------------------------------------+
```

---

### 5.1 Navigation Bar (`Nav.tsx`)
- **Visual Presentation**:
  - Fixed at the top of the viewport (`fixed top-0 left-0 right-0 z-50`).
  - Initially renders with a lightweight translucent background (`bg-surface/60 backdrop-blur-sm`).
  - Upon scrolling down > 20px, dynamically transitions via React state into a structured glassmorphic bar (`bg-surface/90 backdrop-blur-md border-b border-border shadow-subtle py-3`).
- **Brand Logo**:
  - Rounded square icon box holding an isometric 3D cube SVG icon.
  - Text typography: `SHARED.ENGINE` in uppercase bold monospace with orange `.ENGINE` accent, followed by `FOUNDATION OS` in micro-spaced subtext.
- **Navigation Links**:
  - `Components` &rarr; `#components` (Smooth scrolls down to the 3D Explorer)
  - `Case studies` &rarr; `#case-studies`
  - `Builders` &rarr; `#builders`
  - `Startups` &rarr; `#startups`
- **Actions**:
  - Desktop `Talk to us` button (Primary orange button linking to `#contact`).
  - Mobile responsive hamburger menu button that opens a full-width floating modal sheet with navigation links and action CTA.

---

### 5.2 Editorial Hero Header (`Hero.tsx`)
- **Status Pill**:
  - Centered badge with a pulsing Leica Orange dot (`animate-pulse`).
  - Monospace text: `ENTERPRISE FOUNDATION OS | DECOUPLED ARCHITECTURE`.
- **Primary Headline**:
  - `Build faster on an engine that's already engineered.`
  - Styled with an italicized, warm accent underline decoration (`decoration-accent/30 underline-offset-8`).
- **Sub-headline**:
  - *"An elite shared foundation OS provides multi-cloud datum, zero-trust security, and a frontier neural bus once — so every engineering squad only builds what makes them unique."*
- **Action CTAs**:
  - **`Talk to engineering`**: Primary button with signature orange glow (`shadow-glow hover:shadow-glow-lg`).
  - **`Explore 8-Layer Stack ↓`**: Tactile white card button with an arrow icon. Clicking triggers a smooth programmatic scroll directly to progress 0.95 of the pinned explorer.
- **Live Production Telemetry Row**:
  - Three inline metric columns separated by subtle vertical hairpins:
    - **50+** Builds Online (Green emerald dot)
    - **30+** Hospitals Active (Leica orange dot)
    - **10+** Institutions (Cyan dot)

---

### 5.3 Pinned 3D Decoupled Architecture Explorer (`Hero.tsx` + `ThreeViewer.tsx`)
This is the **showpiece interactive component** of the entire application.

#### How It Works Mechanically:
1. **Pinned ScrollTrigger Setup**:
   - The outer container `#components` pins its inner child (`pinTargetRef`) for `100%` of the viewport height.
   - Paging is scrubbed continuously via GSAP (`scrub: 0.5`).
   - Orbit controls have `enableZoom: false` so that scrolling on top of the 3D canvas **never traps the user's scroll**.

2. **The 3 Unpacking Stages**:
   - **STAGE 01 (Scroll 0.00 &rarr; 0.40): UNPACKING "YOUR CORE PRODUCT"**
     - The assembly starts **dead center** inside an opaque, precision-machined black server casing (`Enterprise_Monolith_Enclosure`).
     - The front badge displays **`YOUR CORE PRODUCT · ENTERPRISE UNIFIED SYSTEM`** with a glowing orange laser seam across the horizon.
     - As the user scrolls, the top shell lifts upward (+0.28m), the bottom shell descends downward (-0.18m), and the outer casing fades out to complete transparency.
     - Floating HUD pill: *"YOUR CORE PRODUCT · What Your Enterprise Customers See"*.
   - **STAGE 02 (Scroll 0.40 &rarr; 0.75): EXPANDING DECOUPLED STACK**
     - The entire 8-plate stack glides laterally to the left (`x = -0.17m`), creating space on the right for the architecture column.
     - The 8 plates expand vertically along the Y-axis from 0.5 mm to **38.0 mm physical separation**.
     - Camera smoothly interpolates from centered isometric perspective `[0.38, 0.32, 0.44]` to framed left perspective `[0.34, 0.36, 0.54]`.
   - **STAGE 03 (Scroll 0.75 &rarr; 1.00): ARCHITECTURE MATRIX // 8 LAYERS**
     - The stack is fully exploded and locked into modular alignment.
     - The right-hand column fades in (`opacity: 1.0`), revealing the 8 component buttons.
     - Floating HUD pill: *"8-Layer Modular Stack · Decoupled Enterprise OS"*.

3. **Connected Inspection Leader Lines**:
   - Each layer button is visually bridged to the 3D stack via a horizontal dotted engineering line with glowing terminal endpoints.
   - When a layer is hovered or active, the dotted line glows with Leica orange neon glow (`shadow-[0_0_8px_rgba(255,85,0,0.8)]`).

4. **Click-to-Expand Component Dossier**:
   - Clicking any layer button (or clicking the 3D plate directly in WebGL) expands an engineering card directly in place.
   - It renders two crucial enterprise artifacts:
     1. **Live Enterprise Protocol Contract**:
        - Styled as a dark `#090B0E` terminal card with an emerald status indicator.
        - Displays:
          - `INTERFACE:` Protocol standard (e.g. `Unified LLM ABI · Semantic Vector Cache`).
          - `SECURITY:` Compliance certification (e.g. `Zero-Data-Retention Agreements · HIPAA Enclave`).
          - `RUNTIME SLA:` Production availability (e.g. `99.99% Availability · Auto-Fallback`).
          - Badge: `0 CODE REWRITES`.
     2. **Founder Strategic Advantage & ROI**:
        - A warm orange-tinted callout outlining business velocity impact (e.g. *"Cut AI compute costs by 40-70% instantly by swapping frontier models without breaking customer features"*).
     3. **Layer Navigation Controls**:
        - Includes `←` (Prev) and `→` (Next) buttons to cycle through layers without closing the dossier, plus an `×` close button.

---

### 5.4 Deep-Dive: The 8 Decoupled Foundation Layers

| Plate | Name | Category & Architecture Tier | Physical Spec & Material | Enterprise Interface & Security Contract | Founder Strategic ROI |
|:---:|---|---|---|---|---|
| **08** | **Client Glass** | Presentation Surface & Edge State <br> `Client Experience Tier` | 6.0 mm Beveled Optical Glass with raised tactile datum pads (`#C0BDB8`) | `Interface`: Tokenized Design Tokens · React 19 / WebGL <br>`Security`: WCAG 2.1 AA · Sandboxed <br>`SLA`: Sub-16ms Frame Budget (60+ FPS) | Launch brand-new customer dashboards in days with zero design debt. |
| **07** | **Modular Apps** | Decoupled Application Cartridges <br> `Business Capability Tier` | 8.0 mm Satin Titanium with 4× slide-in product bays (`#8A9BA8`) | `Interface`: Micro-Frontend Federation · gRPC Contracts <br>`Security`: Isolated Process Domains · Scoped RBAC <br>`SLA`: Fault-Domain Isolated (0 Cascade Failures) | Scale from 5 to 50+ engineers with zero deployment bottlenecks or release train locks. |
| **06** | **Reliability Mesh** | State Consistency & Offline Mesh <br> `Reliability & Event Store Tier` | 8.0 mm Dark Titanium spine with 6× optical coupler sockets (`#5A6570`) | `Interface`: Raft Consensus · Event Sourcing Log · Arrow IPC <br>`Security`: RPO = 0 · Cryptographic Audit Ledger <br>`SLA`: 99.999% SLA · Active-Active Multi-Region | Eliminates 6+ months of building bespoke offline sync and multi-region failover. |
| **05** | **Decision Policy** | Policy Routing & Compliance Rules <br> `Policy & Governance Tier` | 8.0 mm Satin Titanium with 3-branch routing manifold (`#8A9BA8`) | `Interface`: Open Policy Agent (OPA) · WASM Policy Gates <br>`Security`: Immutable Audit Trail · SOC2 Verified <br>`SLA`: 100% Deterministic (< 0.5ms Execution) | Update enterprise business policies and pass external compliance audits in minutes with zero redeploys. |
| **04** | **Intelligence AI** *(Hero Layer)* | Hot-Swappable AI Model Gateway <br> `AI Intelligence Tier` | 8.0 mm Signal Orange Dielectric Core with 35 raised hex prisms (`#F26A1B`) | `Interface`: Unified LLM ABI · Semantic Vector Cache · Streaming RPC <br>`Security`: Zero-Data Retention · HIPAA Enclave <br>`SLA`: 99.99% Availability · Auto-Fallback | Cut AI compute costs by 40-70% instantly by swapping frontier models without breaking features. |
| **03** | **Zero-Trust IAM** | Security Perimeter & Token Vault <br> `Zero-Trust Security Tier` | 8.0 mm Dark Titanium ring with 10mm uniform central void (`#5A6570`) | `Interface`: SPIFFE/SPIRE Identity · OAuth2/SAML 2.0 · mTLS Vault <br>`Security`: SOC2 Type II · ISO 27001 · HIPAA BAA Ready <br>`SLA`: FIPS 140-3 Hardware Security Module (HSM) | Shorten enterprise procurement and security audits by 3-5 months with pre-certified controls. |
| **02** | **Ingestion Bus** | Real-Time Ingestion & Schema Registry <br> `Data Ingestion Tier` | 8.0 mm Satin Titanium with 4× longitudinal bus grooves (`#8A9BA8`) | `Interface`: Kafka / Redpanda / Apache Flink / Arrow Streaming <br>`Security`: End-to-End Cryptographic Envelope Encryption <br>`SLA`: 4.8M+ Msg/Sec · < 1.0ms P99 Latency | Never worry about database crashes or data corruption during traffic surges from 1K to 10M events. |
| **01** | **Infrastructure** | Multi-Cloud & Sovereign Datum <br> `Base Infrastructure Tier` | 12.0 mm Hardened Base Graphite structural chassis datum (`#35393C`) | `Interface`: POSIX / Linux KVM / Direct PCIe Gen5 Bus <br>`Security`: Air-Gapped Tier IV Enclave · Zero-Lockin <br>`SLA`: < 0.8 µs Bus Latency · 99.999% Hardware Availability | Close multi-cloud and on-prem enterprise deals without maintaining separate codebase forks. |

---

### 5.5 Verified Live Telemetry Strip (`ProofStrip.tsx`)
- **Telemetry Status Ribbon**:
  - Green pulsing beacon: `LIVE PRODUCTION TELEMETRY`.
  - Live SLA readouts: `UPTIME: 99.998%`, `REWRITE RATIO: 0.00%`, `SPEC: TITANIUM CHASSIS`.
- **3 Metric Display Cards**:
  1. **50+ BUILDS** (`SYS_METRIC_01`): Production applications and services deployed across enterprise product teams.
  2. **30+ HOSPITALS** (`SYS_METRIC_02`): Clinical facilities and health networks running on shared foundational infrastructure.
  3. **10+ INSTITUTIONS** (`SYS_METRIC_03`): Research universities and academic healthcare institutions building together.
- **Dynamic Elements**:
  - Custom SVG icons (`cube`, `hospital`, `pillars`).
  - Subtle progress ticker bars at the base of each card (`80%`, `88%`, `96%` width).

---

### 5.6 Non-Destructive Architectural Statement & Isometric Blueprint (`Statement.tsx`)
- **The Core Thesis**:
  - Section Badge: `Non-Destructive Architecture`.
  - Heading: **"Complex problems. Simpler building."**
  - Supporting Statement: *"You already have battle-tested systems. We engineer directly around and on top of them. We never demand high-risk 'rip and replace' migrations."*
- **Two Supporting Architecture Cards**:
  - **Standardized Chassis**: Preserve your existing hardware, on-prem clusters, and clinical repositories without disruption.
  - **Decoupled Upgrades**: Upgrade or swap model intelligence and sync layers without refactoring front-end customer apps.
- **Custom Isometric Blueprint SVG Graphic**:
  - Renders a technical blueprint diagram on an engineering coordinate grid:
    - **Plate 08**: Top silver presentation surface (`#E8E5DF`).
    - **Plate 04**: Glowing orange modular intelligence die (`#F26A1B`).
    - **Plate 01**: Hardened dark base chassis (`#35393C`) with 4 mounting datum inset holes.
    - **Vertical Inter-Layer Data Bus Pipeline**: Animated dashed orange bus line (`animate-bus-dash`) connecting all layers through their datum centers.
    - Blueprint annotation tags: `DATA BUS PIPELINE`, `ZERO REWRITE`, and `FOUNDATION TOPOLOGY 100% NON-DESTRUCTIVE`.

---

### 5.7 Universal Dynamic Modular Hot-Swap Console (`ModelSwap.tsx`)
This section visually and interactively proves that **any layer in the architecture can be hot-swapped live with zero downtime and zero code rewrites**.

- **Console Architecture**:
  - **Left Bay (Col 1-7)**: Full-height 3D WebGL assembly viewport. Displays the entire 8-layer stack with an airy 20 mm separation so all components are visible simultaneously.
  - **Right Control Rack (Col 8-12)**:
    - **8-Slot Selection Rack**: A clean 2-column grid allowing the user to click any slot (`Slot 01: Base Chassis` through `Slot 08: Experience Glass`).
    - **Active Module Selector**: Displays Version A vs Version B options for the selected slot.

#### The Physical Hot-Swap Physics:
When the visitor toggles between Version A and Version B:
1. **Phase 1 (Physical Ejection)**: The targeted 3D plate smoothly slides out to the right along the X-axis (`x = +0.42m`, duration 0.32s, easing `power2.in`).
2. **Phase 2 (Material Morph)**: While the plate is physically outside the chassis, its PBR materials, colors, and roughness instantly update to the new version's specifications.
3. **Phase 3 (Opposite Entry)**: The plate teleports to the opposite side (`x = -0.42m`) and smoothly glides into the stack slot from the left (duration 0.44s, easing `power3.out`).
4. **Phase 4 (Mechanical Latch Flash)**: Upon reaching `x = 0.0`, the dynamic point light at that plate's datum coordinates emits a brilliant latch confirmation flash (`intensity: 3.2` down to `0`), simulating physical locking pins engaging.

#### The 8 Hot-Swap Profiles Supported:
1. **Slot 01 (Chassis)**: On-Prem Bare Metal Linux Cluster (`< 0.8 µs` latency) **vs** AWS Outposts / Azure Stack Enclave (FIPS 140-3 Level 4).
2. **Slot 02 (Data Ingestion)**: Apache Kafka + Flink (`4.8M msgs/sec`) **vs** ClickHouse + Redpanda (`12.4M rows/sec`).
3. **Slot 03 (Security)**: Okta OIDC + SAML 2.0 (`12 ms` auth) **vs** SPIFFE / SPIRE Cryptographic Workload Mesh (Instant ephemeral X.509 SVIDs).
4. **Slot 04 (Intelligence AI)**: Claude 3.5 Sonnet / Opus (Anthropic Bedrock) **vs** OpenAI GPT-4o / DeepSeek R1 Hybrid (Azure Foundry).
5. **Slot 05 (Decisions)**: Open Policy Agent (OPA) WASM **vs** Camunda 8 Zeebe BPMN Orchestrator.
6. **Slot 06 (Reliability & Sync)**: Raft Consensus + Arrow IPC Log **vs** CockroachDB Multi-Region Distributed SQL.
7. **Slot 07 (Modular Apps)**: React 19 Micro-Frontend Federation **vs** WebAssembly Sandboxed Micro-Container Cartridges.
8. **Slot 08 (Client Glass)**: Enterprise Design System (Tailwind + WebGL) **vs** Native Mobile Swift / Kotlin Multiplatform Surface.

---

### 5.8 Case Studies & Production Deployments (`CaseStudies.tsx`)
Demonstrates proven enterprise viability through three distinct domain implementations:

1. **Healthcare Infrastructure**:
   - **Title**: Federated Clinical Diagnostic Pipeline
   - **Audience**: Regional Healthcare Network (30+ Hospitals)
   - **Mounted Foundation Plates**: Plate 04 (Model Gateway) + Plate 03 (Access & Security)
   - **Outcome**: Decoupled diagnostic inference models from on-premise PACS scanners, enabling model updates in minutes rather than quarters.
   - **Verified Metric**: `94% Reduction in deployment cycle time`.

2. **Enterprise Governance**:
   - **Title**: Deterministic Regulatory Decision System
   - **Audience**: Multinational Financial Clearinghouse
   - **Mounted Foundation Plates**: Plate 05 (Decisions) + Plate 06 (Reliability & Sync)
   - **Outcome**: Built a shared zero-trust audit stream handling millions of transactions daily with verifiable state verification.
   - **Verified Metric**: `12M+ Daily audit events processed`.

3. **Research Consortium**:
   - **Title**: Cross-Institutional Genomic Mesh
   - **Audience**: 10+ Academic Research Centers
   - **Mounted Foundation Plates**: Plate 02 (Data Ingestion) + Plate 08 (Experience Glass)
   - **Outcome**: Unified disparate patient genomic datasets across institutions while maintaining strict HIPAA tenant boundaries.
   - **Verified Metric**: `100% Zero-leak data boundary compliance`.

---

### 5.9 Engineering Guild Timeline (`Builders.tsx`)
Highlights the pedigree and human engineering craft behind the foundation:
- Section Badge: `Engineering Guild`.
- Headline: **"Engineered by systems architects."**
- Connected Horizontal Timeline across 4 roles:
  1. **MENTOR (10+ YEARS)** — *Foundation Steward*: Specializes in high-assurance operating primitives, threat modeling, and distributed consensus.
  2. **ARCHITECT (5+ YEARS)**: Designs horizontally scalable streaming pipelines, multi-cloud topologies, and fault tolerance.
  3. **SENIOR ENGINEER (3+ YEARS)**: Crafts low-latency interactive WebGL visualization, canvas pipelines, and state machines.
  4. **PRODUCT BUILDER (< 1 YEAR)**: Pairs with domain product teams to test foundation abstractions against live customer requirements.

---

### 5.10 Direct Deployment Console & Inquiry Terminal (`CTABand.tsx`)
Replaces conventional static lead-generation forms with an interactive engineering console:
- **Heading**: **"Ready to deploy your shared foundation?"**
- **Terminal Console Frame**: Styled with macOS/Linux terminal window dots (red, yellow, green) and a live `bash: shared-engine-cli v3.2 | ONLINE` status.
- **Simulated Terminal Execution**:
  ```bash
  $ shared-foundation init --target=enterprise-vpc --modules=8
  ✓ Chassis datum anchor verified (Plate 01 - 300x200mm)
  ✓ Streaming bus & zero-trust perimeter locked (Plates 02-03)
  ● Neural compute core hot-swap interface active (Plate 04)
  ✓ Deterministic sync & UI micro-surfaces mounted (Plates 05-08)
  → Foundation verified: 0 lines of legacy code rewritten.
  ```
- **Live Inquiry Form**:
  - Embedded inside the console below the CLI stream.
  - Visitor enters work email & clicks **`Deploy Stack`**.
  - Triggers interactive state change to: **"Deployment Spec Dispatched: Engineering architecture dossier sent to [email]. Lead architect will respond within 24h."**

---

### 5.11 Engineering Footer (`Footer.tsx`)
- Fixed bottom footer anchored with:
  - Engineering brand logo: `SHARED.ENGINE FOUNDATION OS`.
  - Quick anchors to all sections (`Components`, `Case studies`, `Builders`, `Startups`).
  - Copyright and engineering guarantee: *"Engineered for resilience and velocity · 100% Non-Destructive"*.

---

### 5.12 Deep Routing & Detail Stubs (`ComponentDetailStub.tsx`)
- Configured in `App.tsx` under `/components/:slug`.
- If a user clicks through to an individual plate slug (e.g. `/components/plate-04-intelligence`), this page provides an architectural stub displaying the slug, technical category badge, and a return-to-home action.

---

## 6. 3D WebGL Graphics Engine Deep Dive (`ThreeViewer.tsx`)

`ThreeViewer.tsx` is an optimized, industrial-grade WebGL component with over 1,000 lines of custom Three.js code.

### 6.1 Singleton GLTF Model Cache
To prevent memory leaks, texture reloading, or flashing during hot-swaps and route changes, the GLTF assembly is loaded into a module-level singleton cache:
```typescript
let cachedGLTFScene: THREE.Group | null = null;
let modelLoadPromise: Promise<THREE.Group> | null = null;
```
When a component mounts, it deep-clones the scene and instantiates fresh `MeshStandardMaterial` instances so each viewer can modify emissive highlights and positions independently.

### 6.2 Camera Keyframes & Interpolation
In `scroll-exploded` mode, the camera position is computed using continuous parametric interpolation:
- At `progress = 0.00`: Isometric close-up `[0.38, 0.32, 0.44]` framing the sealed monolith.
- At `progress = 0.80 - 1.00`: Left-offset isometric overview `[0.34, 0.36, 0.54]` framing the expanded 8-layer stack while leaving the right 50% of the canvas clear for DOM cards.

### 6.3 Specialized Micro-Animations per Layer
When an active layer is inspected, a dynamic point light and a 3D datum reticle beacon pulse at that plate's specific mechanical datum coordinates:
1. **Plate 01 (`torque`)**: Strobe flash on datum pins (`#FF5500`, 2.8 intensity).
2. **Plate 02 (`packets`)**: Blue pulse streaming back and forth along longitudinal channels (`#38BDF8`).
3. **Plate 03 (`perimeter-sweep`)**: Orbital circular sweep around the perimeter void.
4. **Plate 04 (`neural-heatsink`)**: Respiration sine-wave breathing on the neural honeycomb die.
5. **Plate 05 (`policy-gates`)**: Alternating amber light phase across the 3 routing branches (`#F59E0B`).
6. **Plate 06 (`optical-couplers`)**: High-speed green sequence cycling through 6 coupler sockets (`#10B981`).
7. **Plate 07 (`cartridge-dock`)**: Physical slide excursion of cartridge meshes along rails.
8. **Plate 08 (`glass-scanline`)**: High-specular white scanline sweeping across the top optical face.

### 6.4 Raycasting & Drag Disambiguation
Pointer events track both drag distance and click coordinates:
```typescript
const dist = Math.hypot(event.clientX - pointerDownPos.x, event.clientY - pointerDownPos.y);
if (dist <= 6) {
  // Treated as click: selects intersected layer
}
```
If `dist > 6px`, the gesture is treated as an orbit drag and does not trigger unintended layer selections.

---

## 7. Procedural 3D Blender Asset Pipeline (`tools/blender/`)

All 3D assets are generated via Python code using Blender’s API (`bpy`). This ensures that if any physical tolerance, dimension, or datum position changes, the entire asset library can be rebuilt headlessly.

### 7.1 Coordinate System & Physical Standards
- **Standard**: GLTF (Y-Up, Right-Handed).
- **Scale**: Metric 1.0 (1 unit in Blender = 1 meter in WebGL).
- **Outer Plate Dimensions**: $300 \text{ mm} \times 200 \text{ mm}$ ($X = 0.30\text{m}, Z = 0.20\text{m}$).
- **Datum Mounting Pins**: 4 through-holes, $\varnothing 6.0 \text{ mm}$, inset $15 \text{ mm}$ from boundaries ($X = \pm 135 \text{ mm}, Z = \pm 85 \text{ mm}$).
- **Corner Fillet**: $6.0 \text{ mm}$ radius.
- **Edge Bevel**: $0.8 \text{ mm} \times 45^\circ$ mechanical chamfer.

### 7.2 Headless Asset Generation Commands
```bash
# Rebuild individual plate (e.g. Plate 04)
blender --background --python tools/blender/generate_plate.py -- 4

# Rebuild all 8 plates and the master assembly GLB
blender --background --python tools/blender/rebuild_all_assets.py

# Validate GLTF compliance, polygon counts, and PBR materials
python tools/blender/validate.py
```

---

## 8. Developer Onboarding & Step-by-Step Refinement Guide

### 8.1 Local Development Setup
1. **Clone the repository**:
   ```bash
   git clone https://github.com/Ottobon-INC/SharedEngineering-LandingPage.git
   cd SharedEngineering-LandingPage
   ```
2. **Install Node dependencies**:
   ```bash
   npm install
   ```
3. **Start local development server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173` in Chrome, Firefox, or Edge.
4. **Code Quality & Linting**:
   ```bash
   npm run lint   # Runs oxlint for high-speed static validation
   npm run build  # Validates TypeScript compilation and builds Vite bundle
   ```

---

### 8.2 Common Development Workflows

#### Task A: How to Modify the Copy or Specifications of a Layer
1. Open `src/content/steps.ts`.
2. Locate the target `ARCHITECTURE_STEPS` entry (keyed by `plateId: 1` through `8`).
3. Update `title`, `description`, `whyShared`, `founderROI`, or the `softwareSpecs` fields (`interfaceProtocol`, `securityCompliance`, `runtimeSLA`).
4. Changes will hot-reload immediately across the Hero Explorer and Component Dossiers.

#### Task B: How to Add a New Option to the Hot-Swap Workstation
1. Open `src/content/swapConfigs.ts`.
2. Find the target layer in `SWAP_PROFILES[layerId]`.
3. Update `versionA` or `versionB`:
   - Change `provider`, `name`, `hardwareSpec`, `color` (hex), or `emissive` (hex).
   - Update `metrics.metric1Label`, `metric1Value`, `metric2Label`, `metric2Value`.
4. If you change `color`, Three.js will dynamically paint the plate with the new PBR color during the live slide-in animation.

#### Task C: How to Tune 3D Camera Angles or Explosion Distances
1. Open `src/components/StackVisual/layerSpecs.ts`.
2. `camPos` controls the 3D isometric camera coordinates `[X, Y, Z]`.
3. `datumCoord` controls the precise coordinates where the glowing neon reticle beacon appears.
4. Open `src/components/StackVisual/ThreeViewer.tsx`:
   - `gapExploded` (currently `0.038` = 38mm) controls the vertical expansion gap in the Hero explorer.
   - `gapSwap` (currently `0.020` = 20mm) controls the whole-assembly plate spacing in the Hot-Swap bay.

---

## 9. Future Roadmap & Engineering Backlog

If you are joining the team to advance this codebase, here is the prioritized engineering backlog:

1. **Full Sub-Page Implementation (`/components/:slug`)**:
   - Currently, `/components/:slug` renders `ComponentDetailStub.tsx`.
   - **Target**: Create rich interactive specification pages for each layer featuring an isolated 3D plate viewer, interactive API contract playground, gRPC schema definitions, and downloadable SDK snippets.
2. **WebGPU Renderer Upgrade**:
   - Upgrade Three.js renderer from WebGL to `WebGPURenderer` for systems supporting WebGPU, enabling hardware-accelerated volumetric lighting and contact shadows.
3. **Interactive Audio Feedback**:
   - Add subtle, satisfying industrial mechanical clicks and pneumatic hiss sound effects (Web Audio API) when plates un-dock and latch during hot-swap simulations.
4. **Interactive Lead Flow Integration**:
   - Connect the email form in `CTABand.tsx` to an actual enterprise CRM API (e.g. HubSpot, Salesforce, or Resend API) with automated PDF architecture dossier generation.

---

> **End of Specification**.  
> For technical inquiries, reach out to the Systems Architecture Guild or open a pull request on the repository.
