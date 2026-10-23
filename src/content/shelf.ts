export interface ShelfItem {
  id: string;
  plateId: number;
  title: string;
  category: string;
  description: string;
  badge: string;
  icon: 'cube' | 'network' | 'database' | 'shield' | 'puzzle' | 'grid';
  layerSlug: string;
}

export const SHELF_ITEMS: ShelfItem[] = [
  {
    id: 'data-layer',
    plateId: 2,
    title: 'DATA LAYER',
    category: 'Ingestion & Schema Registry',
    description: 'High-throughput streaming connectors with automatic schema validation and dead-letter queue routing.',
    badge: 'v2.4 Ready',
    icon: 'cube',
    layerSlug: 'plate-02-data-in',
  },
  {
    id: 'model-gateway',
    plateId: 4,
    title: 'MODEL GATEWAY',
    category: 'Unified AI Interface',
    description: 'Multi-provider routing layer supporting hot model swaps between Claude, Gemini, GPT, and local models.',
    badge: 'Zero Downtime',
    icon: 'network',
    layerSlug: 'plate-04-intelligence',
  },
  {
    id: 'event-stream',
    plateId: 6,
    title: 'EVENT STREAM',
    category: 'Distributed Ledger & Mesh',
    description: 'Zero-loss event sourcing and offline synchronization designed for mission-critical client reliability.',
    badge: '99.999% SLA',
    icon: 'database',
    layerSlug: 'plate-06-reliability-sync',
  },
  {
    id: 'security',
    plateId: 3,
    title: 'SECURITY',
    category: 'Zero-Trust Perimeter',
    description: 'Cryptographic identity attestation, automated key rotation, and granular role-based policy enforcement.',
    badge: 'SOC2 Compliant',
    icon: 'shield',
    layerSlug: 'plate-03-access-security',
  },
  {
    id: 'integrations',
    plateId: 5,
    title: 'INTEGRATIONS',
    category: 'Deterministic Workflows',
    description: 'Pre-certified enterprise connectors for ERP, EHR, billing, and legacy relational databases.',
    badge: '20+ Connectors',
    icon: 'puzzle',
    layerSlug: 'plate-05-decisions',
  },
  {
    id: 'observability',
    plateId: 7,
    title: 'OBSERVABILITY',
    category: 'Telemetry & Audit Logs',
    description: 'End-to-end distributed tracing, real-time structured telemetry, and cryptographically verifiable audit trails.',
    badge: 'OpenTelemetry',
    icon: 'grid',
    layerSlug: 'plate-07-applications',
  },
];
