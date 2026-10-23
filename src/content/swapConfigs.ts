export interface SwapOption {
  name: string;
  provider: string;
  hardwareSpec: string;
  color: string;
  emissive: string;
  badge: string;
  metrics: {
    metric1Label: string;
    metric1Value: string;
    metric2Label: string;
    metric2Value: string;
  };
}

export interface ComponentSwapProfile {
  layerId: number;
  layerName: string;
  category: string;
  title: string;
  description: string;
  versionA: SwapOption;
  versionB: SwapOption;
}

export const SWAP_PROFILES: Record<number, ComponentSwapProfile> = {
  1: {
    layerId: 1,
    layerName: 'Plate 01 Existing System',
    category: 'Hardware & Infrastructure Base Anchor',
    title: 'Base Chassis Foundation',
    description: 'Hot-swap between on-premise high-density bare-metal clusters and sovereign cloud VPC enclaves without modifying hardware datum fixtures.',
    versionA: {
      name: 'On-Prem Bare Metal Linux Cluster',
      provider: 'Supermicro 2U Bare-Metal Enclave',
      hardwareSpec: 'Hardened Base Graphite · Direct PCIe Gen5 Bus',
      color: '#35393C',
      emissive: '#FF5500',
      badge: 'ON-PREM RACK',
      metrics: {
        metric1Label: 'BUS LATENCY',
        metric1Value: '< 0.8 µs',
        metric2Label: 'ISOLATION LEVEL',
        metric2Value: 'Air-Gapped Tier IV',
      },
    },
    versionB: {
      name: 'AWS Outposts / Azure Stack Enclave',
      provider: 'Hybrid Sovereign Cloud Host',
      hardwareSpec: 'Dark Slate Alloy · Encrypted HSM Core Module',
      color: '#1E293B',
      emissive: '#38BDF8',
      badge: 'CLOUD ENCLAVE',
      metrics: {
        metric1Label: 'BUS LATENCY',
        metric1Value: '1.2 µs',
        metric2Label: 'ISOLATION LEVEL',
        metric2Value: 'FIPS 140-3 Level 4',
      },
    },
  },
  2: {
    layerId: 2,
    layerName: 'Plate 02 Data Ingestion',
    category: 'High-Throughput ETL & Validation',
    title: 'Data Ingestion Slide Manifold',
    description: 'Switch between distributed streaming event logs and columnar vector stores without restructuring downstream database schemas.',
    versionA: {
      name: 'Apache Kafka + Apache Flink Streaming ETL',
      provider: 'Distributed Event Log & Stream Engine',
      hardwareSpec: 'Satin Titanium Runners · 4× D-Sub Lane Pointers',
      color: '#8A9BA8',
      emissive: '#FF5500',
      badge: 'STREAMING PIPELINE',
      metrics: {
        metric1Label: 'PEAK INGESTION',
        metric1Value: '4.8M msgs/sec',
        metric2Label: 'VALIDATION DRIFT',
        metric2Value: '0.00% Zero-Loss',
      },
    },
    versionB: {
      name: 'ClickHouse + Redpanda Real-Time Columnar',
      provider: 'Real-Time Vectorized Analytics Ingestion',
      hardwareSpec: 'Anodized Sky Titanium · Direct SIMD Compression',
      color: '#0284C7',
      emissive: '#38BDF8',
      badge: 'COLUMNAR INGEST',
      metrics: {
        metric1Label: 'PEAK INGESTION',
        metric1Value: '12.4M rows/sec',
        metric2Label: 'VALIDATION DRIFT',
        metric2Value: '0.00% Zero-Loss',
      },
    },
  },
  3: {
    layerId: 3,
    layerName: 'Plate 03 Access & Security',
    category: 'Zero-Trust Perimeter & Token Management',
    title: 'Structural Security Frame Ring',
    description: 'Hot-swap enterprise identity providers and microsegmentation perimeter meshes without changing service access tokens.',
    versionA: {
      name: 'Okta OIDC + Enterprise SAML 2.0 Perimeter',
      provider: 'Centralized Identity & Federation Broker',
      hardwareSpec: 'Dark Titanium Ring · 10 mm Perimeter Air Gap',
      color: '#5A6570',
      emissive: '#FF5500',
      badge: 'ENTERPRISE SSO',
      metrics: {
        metric1Label: 'AUTH HANDSHAKE',
        metric1Value: '12 ms',
        metric2Label: 'TOKEN REVOCATION',
        metric2Value: 'Instant (< 250ms)',
      },
    },
    versionB: {
      name: 'SPIFFE / SPIRE Cryptographic Workload Mesh',
      provider: 'Zero-Trust Ephemeral X.509 SVID Enclave',
      hardwareSpec: 'Cryptographic Deep Violet Titanium Perimeter',
      color: '#4C1D95',
      emissive: '#A855F7',
      badge: 'SPIFFE ZERO-TRUST',
      metrics: {
        metric1Label: 'AUTH HANDSHAKE',
        metric1Value: '1.4 ms',
        metric2Label: 'TOKEN REVOCATION',
        metric2Value: 'Automatic 10m TTL',
      },
    },
  },
  4: {
    layerId: 4,
    layerName: 'Plate 04 Intelligence Core',
    category: 'Modular AI Gateway & Model Routing',
    title: 'Hot-Swappable AI Compute Core',
    description: 'Physically isolates model routing, prompt schemas, and context caching. Switching providers never requires rewriting downstream applications.',
    versionA: {
      name: 'Anthropic Claude 3.5 Sonnet Gateway',
      provider: 'Frontier Anthropic Reasoning API Adapter',
      hardwareSpec: 'Signal Orange Dielectric Core · 16 Heatsink Fins',
      color: '#E65100',
      emissive: '#FF5500',
      badge: 'CLAUDE SONNET',
      metrics: {
        metric1Label: 'REASONING SCORE',
        metric1Value: '93.7% GPQA',
        metric2Label: 'FIRST TOKEN',
        metric2Value: '180 ms',
      },
    },
    versionB: {
      name: 'Google Gemini 2.5 Flash / Vertex AI Mesh',
      provider: 'High-Throughput Multimodal Inference Cluster',
      hardwareSpec: 'Dark Titanium Matrix Core · Emerald Neural Ring',
      color: '#3A4B58',
      emissive: '#10B981',
      badge: 'GEMINI FLASH',
      metrics: {
        metric1Label: 'CONTEXT CAPACITY',
        metric1Value: '1.0M Tokens',
        metric2Label: 'FIRST TOKEN',
        metric2Value: '94 ms',
      },
    },
  },
  5: {
    layerId: 5,
    layerName: 'Plate 05 Decisions & Policy',
    category: 'Deterministic Policy & Workflow Rules',
    title: 'Deterministic Routing Hub',
    description: 'Hot-swap policy compliance engines from declarative declarative Rego rules to durable event-sourced state machine workers.',
    versionA: {
      name: 'Open Policy Agent (OPA) Rego Engine',
      provider: 'Declarative Compliance & Access Policy Arbiter',
      hardwareSpec: 'Satin Titanium · 3-Branch Lateral Distribution',
      color: '#8A9BA8',
      emissive: '#F59E0B',
      badge: 'OPA REGO RULES',
      metrics: {
        metric1Label: 'DECISION EVAL',
        metric1Value: '< 0.35 ms',
        metric2Label: 'AUDIT TRACE',
        metric2Value: '100% Deterministic',
      },
    },
    versionB: {
      name: 'Temporal.io Durable Workflow Orchestrator',
      provider: 'Fault-Tolerant Distributed Saga Coordinator',
      hardwareSpec: 'Amber Stepped Shelf Lands · 20 mm Clearance',
      color: '#B45309',
      emissive: '#FBBF24',
      badge: 'TEMPORAL SAGA',
      metrics: {
        metric1Label: 'STATE DURABILITY',
        metric1Value: 'Raft-Replicated',
        metric2Label: 'COMPENSATION',
        metric2Value: 'Zero Unhandled Leaks',
      },
    },
  },
  6: {
    layerId: 6,
    layerName: 'Plate 06 Reliability & Sync',
    category: 'Event Sourcing & Offline Mesh',
    title: 'Reliability & Sync Bus',
    description: 'Swap between strict Raft quorum consensus and offline-first Conflict-Free Replicated Data Types (CRDTs).',
    versionA: {
      name: 'Distributed Raft Consensus Spine',
      provider: 'Strong Consistency Cluster Coordinator',
      hardwareSpec: 'Dark Titanium Spine · 6× Optical Coupler Sockets',
      color: '#5A6570',
      emissive: '#10B981',
      badge: 'RAFT QUORUM',
      metrics: {
        metric1Label: 'CONSENSUS TIME',
        metric1Value: '4.2 ms Quorum',
        metric2Label: 'FAILOVER SLA',
        metric2Value: '< 150 ms Leader Election',
      },
    },
    versionB: {
      name: 'Automerge / Yjs CRDT Vector Clock Mesh',
      provider: 'Local-First Peer-to-Peer Synchronization',
      hardwareSpec: 'Teal Anodized Spine · 8 Transverse Sync Tracks',
      color: '#0F766E',
      emissive: '#2DD4BF',
      badge: 'CRDT LOCAL-FIRST',
      metrics: {
        metric1Label: 'OFFLINE MERGE',
        metric1Value: '0 Conflicts',
        metric2Label: 'BANDWIDTH',
        metric2Value: 'Delta-Compressed',
      },
    },
  },
  7: {
    layerId: 7,
    layerName: 'Plate 07 Applications',
    category: 'Modular Product Workspaces',
    title: 'Modular Capability Engine',
    description: 'Hot-swap full domain application cartridges without altering underlying data ingestion, security tokens, or AI model gateways.',
    versionA: {
      name: 'Clinical Decision Support Workspace (v1.4)',
      provider: 'EHR-Integrated Clinical Analytics Module',
      hardwareSpec: 'Satin Titanium Rail Base · 4 Slide-In Doctor Bays',
      color: '#8A9BA8',
      emissive: '#FF5500',
      badge: 'CLINICAL CDS v1.4',
      metrics: {
        metric1Label: 'MODULAR FOOTPRINT',
        metric1Value: '4 Cartridge Bays',
        metric2Label: 'APP STARTUP',
        metric2Value: 'Instant (Shared Mem)',
      },
    },
    versionB: {
      name: 'Patient Telehealth & Remote Monitoring (v2.0)',
      provider: 'Consumer-Facing Patient Care Workspace',
      hardwareSpec: 'Burnt Coral Cartridges · Upward Alignment Pins',
      color: '#C2410C',
      emissive: '#FB923C',
      badge: 'PATIENT PORTAL v2.0',
      metrics: {
        metric1Label: 'MODULAR FOOTPRINT',
        metric1Value: '4 Cartridge Bays',
        metric2Label: 'APP STARTUP',
        metric2Value: 'Instant (Shared Mem)',
      },
    },
  },
  8: {
    layerId: 8,
    layerName: 'Plate 08 Experience Layer',
    category: 'Presentation & Interaction Surfaces',
    title: 'Precision Optical Glass Display',
    description: 'Hot-swap client interface surfaces from high-contrast dark surgeon cockpit consoles to warm alabaster accessible responsive canvases.',
    versionA: {
      name: 'Edge-to-Edge Dark Polarized Glass Cockpit',
      provider: 'Tactical High-Contrast Operating Room Console',
      hardwareSpec: '8.0 mm Dark Polarized Glass · Dual Orange Stripes',
      color: '#0F172A',
      emissive: '#FF5500',
      badge: 'OR COCKPIT DARK',
      metrics: {
        metric1Label: 'CONTRAST RATIO',
        metric1Value: '12.8:1 WCAG AAA',
        metric2Label: 'FRAME BUDGET',
        metric2Value: '120 Hz Steady',
      },
    },
    versionB: {
      name: 'Warm Alabaster Gallery White Design Canvas',
      provider: 'Accessible Responsive Clinical & Admin Interface',
      hardwareSpec: 'Acid-Etched Alabaster Glass · Tactile Datum Pads',
      color: '#E2E8F0',
      emissive: '#F97316',
      badge: 'ALABASTER WHITE',
      metrics: {
        metric1Label: 'LIGHT-MODE REFLECT',
        metric1Value: '0.4% Anti-Glare',
        metric2Label: 'ACCESSIBILITY',
        metric2Value: '100% Screen-Reader Safe',
      },
    },
  },
};
