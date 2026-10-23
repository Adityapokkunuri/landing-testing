# Enterprise Foundation OS — Decoupled Architecture Explorer

An elite, high-performance web experience demonstrating a modern **8-Layer Decoupled Enterprise Foundation OS** with real-time 3D WebGL visualization, scroll-driven mechanical unpacking, click-to-expand architecture dossiers, and modular hot-swap demonstration.

---

## 🌟 Highlights & Features

1. **3D Decoupled Architecture Explorer**:
   - **Sealed Monolith Entry**: Begins centered as `"YOUR CORE PRODUCT"` — the unified product view enterprise customers see.
   - **Scroll-Driven Mechanical Unpack**: Outer enterprise casing opens and dissolves as the 8 decoupled foundational software layers glide laterally to the left and expand vertically into exploded alignment.
   - **Click-to-Expand Component Dossier**: Dotted engineering leader lines connect each 3D plate to its button on the right. Clicking any component illuminates that plate in Leica orange, activates the pulsing terminal beacon, and opens the live **Enterprise Protocol Contract** and **Founder Strategic ROI** card.
   - **Universal Scroll & Orbit**: Seamless mouse-wheel and touch scrolling from anywhere on the canvas with 360° click-and-drag orbit controls.

2. **8 Foundational Software Layers**:
   - `08` **Client Glass** · Presentation Surface & Edge State
   - `07` **Modular Apps** · Isolated Cartridge Sandbox
   - `06` **Reliability Mesh** · Distributed Raft Consensus & IPC
   - `05` **Decision Policy** · Deterministic Rule Engine
   - `04` **Intelligence AI** · Frontier Model Gateway & Routing
   - `03` **Zero-Trust IAM** · Cryptographic Identity Perimeter
   - `02` **Ingestion Bus** · Event Sourcing Log & Stream Bus
   - `01` **Infrastructure** · Universal Multi-Cloud Datum

3. **Bidirectional Hot-Swap Demonstration**:
   - Live interactive demonstration of modular replacement across any layer without code rewrites or downtime.

4. **Blender Procedural Pipeline**:
   - Python automation scripts in `tools/blender/` for procedural plate generation, beveling, parametric datum coordinates, and GLB exports.

---

## 🛠️ Tech Stack

- **Frontend Core**: React 18, TypeScript
- **3D Graphics**: Three.js, WebGL, GLTFLoader, OrbitControls
- **Motion & Interaction**: GSAP (GreenSock) + ScrollTrigger
- **Styling**: Tailwind CSS + Custom Architectural Tech Grid Design System
- **Build Tool**: Vite, Oxlint

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
```bash
# Install dependencies
npm install
```

### Running Locally
```bash
# Start local development server
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build
```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 📂 Project Structure

```
├── public/
│   ├── models/foundation/   # 3D GLB model assets & assembly
│   ├── layers/              # Component layer textures
│   └── renders/             # Offline preview renders
├── src/
│   ├── components/
│   │   ├── layout/          # Nav, Footer
│   │   ├── sections/        # Hero, Statement, ProofStrip, ModelSwap, etc.
│   │   ├── StackVisual/     # ThreeViewer.tsx, layerSpecs.ts, Annotations.tsx
│   │   └── ui/              # Reusable UI primitives (Button, Card, etc.)
│   ├── content/             # Architecture steps, swap profiles, telemetry stats
│   ├── context/             # Global component cycle & active layer state
│   ├── pages/               # HomePage
│   └── index.css            # Design tokens & tech-grid styling
├── tools/blender/           # Procedural Blender generation & validation scripts
└── vite.config.ts
```

---

## 📜 License
Private & Proprietary. All rights reserved.
