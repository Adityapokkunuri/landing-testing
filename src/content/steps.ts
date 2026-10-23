export interface SoftwareSpecs {
  interfaceProtocol: string;
  securityCompliance: string;
  founderVelocity: string;
  runtimeSLA: string;
}

export interface ArchitectureStep {
  step: number;
  plateId: number;
  slug: string;
  title: string;
  category: string;
  description: string;
  whyShared: string;
  founderROI: string;
  softwareSpecs: SoftwareSpecs;
  architectureTier: string;
  thickness?: string;
  material?: string;
  hex?: string;
  image?: string;
}

export const ARCHITECTURE_STEPS: ArchitectureStep[] = [
  {
    step: 1,
    plateId: 8,
    slug: 'plate-08-experience',
    title: 'PRESENTATION GLASS INTERFACE',
    category: 'Unified Experience & Micro-Frontends',
    architectureTier: 'Client Experience Tier',
    description: 'Standardized design system, tokenized accessibility tree, and responsive micro-frontend architecture providing a unified, coherent experience across all customer applications.',
    whyShared: 'Without a shared design system, every product team spends months rebuilding navigation trees, dark modes, and accessibility components with inconsistent styling.',
    founderROI: 'Launch brand-new customer dashboards in days with zero design debt.',
    softwareSpecs: {
      interfaceProtocol: 'Tokenized Design Tokens · React 19 / WebGL',
      securityCompliance: 'WCAG 2.1 AA Certified · Cross-Platform Sandboxed',
      founderVelocity: '10× Faster Frontend Delivery for New Squads',
      runtimeSLA: 'Sub-16ms Frame Budget (60+ FPS)',
    },
    thickness: 'Unified UI Engine',
    material: 'Design System Runtime',
    hex: '#C0BDB8',
    image: '/layers/plate-8.png',
  },
  {
    step: 2,
    plateId: 7,
    slug: 'plate-07-applications',
    title: 'MODULAR CAPABILITY ENGINE',
    category: 'Decoupled Application Cartridges',
    architectureTier: 'Business Capability Tier',
    description: 'Sandboxed application cartridge architecture where distinct feature squads build, test, and ship specialized business features independently on verified foundation rails.',
    whyShared: 'Prevents monolithic codebase sprawl and eliminates brittle release trains. Teams deploy independently without stepping on shared infrastructure.',
    founderROI: 'Scale from 5 to 50+ engineers with zero deployment bottlenecks or merge conflicts.',
    softwareSpecs: {
      interfaceProtocol: 'Micro-Frontend Federation · Type-Safe gRPC Contracts',
      securityCompliance: 'Isolated Process Domains · Role-Scoped Permissions',
      founderVelocity: 'Concurrent Squad Deployment · Zero Release Train Locks',
      runtimeSLA: 'Fault-Domain Isolated (Zero Cascade Failures)',
    },
    thickness: 'Cartridge Bus',
    material: 'Modular Runtime',
    hex: '#8A9BA8',
    image: '/layers/plate-7.png',
  },
  {
    step: 3,
    plateId: 6,
    slug: 'plate-06-reliability-sync',
    title: 'DISTRIBUTED RELIABILITY MESH',
    category: 'State Consistency & Offline Mesh',
    architectureTier: 'Reliability & Event Store Tier',
    description: 'Resilient optical state synchronization engine providing active-active multi-region failover, CQRS distributed consensus, and automatic client reconciliation.',
    whyShared: 'Distributed consistency and sync bugs are notoriously difficult to debug; solving them once at the foundation tier guarantees zero silent data loss.',
    founderROI: 'Eliminates 6+ months of building bespoke offline sync and multi-region failover infrastructure.',
    softwareSpecs: {
      interfaceProtocol: 'Raft Consensus · Event Sourcing Log · Arrow IPC',
      securityCompliance: 'RPO = 0 (Zero Loss) · Cryptographic Audit Ledger',
      founderVelocity: 'Enterprise-Grade Disaster Recovery Built-In',
      runtimeSLA: '99.999% SLA · Active-Active Multi-Region Failover',
    },
    thickness: 'Consensus Engine',
    material: 'Optical Sync Mesh',
    hex: '#5A6570',
    image: '/layers/plate-6.png',
  },
  {
    step: 4,
    plateId: 5,
    slug: 'plate-05-decisions',
    title: 'DETERMINISTIC DECISION HUB',
    category: 'Policy Routing & Compliance Rules',
    architectureTier: 'Policy & Governance Tier',
    description: 'Deterministic rule evaluation engine that decouples regulatory governance, business logic approvals, and audit trails from raw product execution code.',
    whyShared: 'Separating business policy from code execution allows product managers and compliance officers to verify logic without touching production code.',
    founderROI: 'Update enterprise business policies and passing external compliance audits in minutes with zero redeploys.',
    softwareSpecs: {
      interfaceProtocol: 'Open Policy Agent (OPA) · WebAssembly Policy Gates',
      securityCompliance: 'Immutable Deterministic Audit Trail · SOC2 Verified',
      founderVelocity: 'Instant Rule Updates Without Engineering Sprints',
      runtimeSLA: '100% Deterministic Verification (< 0.5ms Execution)',
    },
    thickness: 'Policy Engine',
    material: 'WASM Policy Gates',
    hex: '#8A9BA8',
    image: '/layers/plate-5.png',
  },
  {
    step: 5,
    plateId: 4,
    slug: 'plate-04-intelligence',
    title: 'FRONTIER AI NEURAL CORE',
    category: 'Hot-Swappable AI Model Gateway',
    architectureTier: 'AI Intelligence Tier',
    description: 'Provider-agnostic intelligence gateway supporting real-time model hot-swapping between Claude, GPT, Gemini, and open-weights models (DeepSeek, Llama) with automated caching and fallback.',
    whyShared: 'Frontier AI models evolve bi-weekly. A decoupled intelligence layer allows switching to cheaper, faster models with zero downstream code alteration.',
    founderROI: 'Cut AI compute costs by 40-70% instantly by swapping frontier models without breaking customer features.',
    softwareSpecs: {
      interfaceProtocol: 'Unified LLM ABI · Semantic Vector Cache · Streaming RPC',
      securityCompliance: 'Zero-Data-Retention Agreements · HIPAA Enclave',
      founderVelocity: '1-Click Model Hot-Swap · Zero Downstream Refactoring',
      runtimeSLA: '99.99% Availability with Multi-Provider Auto-Fallback',
    },
    thickness: 'AI Gateway Engine',
    material: 'Neural Compute Die',
    hex: '#F26A1B',
    image: '/layers/plate-4.png',
  },
  {
    step: 6,
    plateId: 3,
    slug: 'plate-03-access-security',
    title: 'ZERO-TRUST IDENTITY RING',
    category: 'Security Perimeter & Token Vault',
    architectureTier: 'Zero-Trust Security Tier',
    description: 'Centralized authentication, fine-grained role-based access control (RBAC), and automated mTLS cryptographic token management safeguarding all enterprise APIs.',
    whyShared: 'Enterprise deals stall on security questionnaires; having enterprise-grade zero-trust identity built-in passes Fortune 500 security audits on day one.',
    founderROI: 'Shorten enterprise procurement and security audits by 3-5 months with pre-certified access controls.',
    softwareSpecs: {
      interfaceProtocol: 'SPIFFE/SPIRE Identity · OAuth2 / SAML 2.0 · mTLS Vault',
      securityCompliance: 'SOC2 Type II · ISO 27001 · HIPAA BAA Ready',
      founderVelocity: 'Pass Enterprise Vendor Security Reviews Instantly',
      runtimeSLA: 'FIPS 140-3 Hardware Security Module (HSM) Enclave',
    },
    thickness: 'Security Ring',
    material: 'Zero-Trust Perimeter',
    hex: '#5A6570',
    image: '/layers/plate-3.png',
  },
  {
    step: 7,
    plateId: 2,
    slug: 'plate-02-data-in',
    title: 'HIGH-THROUGHPUT STREAMING BUS',
    category: 'Real-Time Ingestion & Schema Registry',
    architectureTier: 'Data Ingestion Tier',
    description: 'Zero-loss distributed event streaming bus with automatic schema validation, dead-letter queuing, and low-latency pipeline ingestion.',
    whyShared: 'Eliminates brittle bespoke ETL pipelines and ensures downstream database schemas receive strictly validated payloads.',
    founderROI: 'Never worry about database crashes or data corruption during traffic surges from 1,000 to 10M events.',
    softwareSpecs: {
      interfaceProtocol: 'Kafka / Redpanda / Apache Flink / Arrow Streaming',
      securityCompliance: 'End-to-End Cryptographic Envelope Encryption',
      founderVelocity: 'Plug-and-Play Ingestion Connectors for Any Data Source',
      runtimeSLA: '4.8M+ Messages/Sec Ingestion · < 1.0ms P99 Latency',
    },
    thickness: 'Streaming Bus',
    material: 'Real-Time Ingestion',
    hex: '#8A9BA8',
    image: '/layers/plate-2.png',
  },
  {
    step: 8,
    plateId: 1,
    slug: 'plate-01-existing-system',
    title: 'UNIVERSAL INFRASTRUCTURE DATUM',
    category: 'Multi-Cloud & Sovereign Enclave Foundation',
    architectureTier: 'Base Infrastructure Tier',
    description: 'Universal infrastructure abstraction layer that deploys identically across bare-metal Linux clusters, AWS, GCP, Azure, or sovereign air-gapped on-premise environments.',
    whyShared: 'We never ask you to discard legacy systems or lock into a single cloud. We build modular, high-integrity capability layers directly on top of your existing investments.',
    founderROI: 'Close multi-cloud and on-prem enterprise deals without maintaining expensive separate codebase forks.',
    softwareSpecs: {
      interfaceProtocol: 'POSIX / Linux KVM / Direct Bare-Metal PCIe Gen5 Bus',
      securityCompliance: 'Air-Gapped Tier IV Enclave · Zero-Lockin Portability',
      founderVelocity: '100% Code Reuse Across Cloud, Hybrid, and On-Premises',
      runtimeSLA: '< 0.8 µs Bus Latency · 99.999% Hardware Availability',
    },
    thickness: 'Chassis Datum',
    material: 'Universal Base Anchor',
    hex: '#35393C',
    image: '/layers/plate-1.png',
  },
];
