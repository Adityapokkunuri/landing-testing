export interface CaseStudy {
  id: string;
  badge: string;
  title: string;
  audience: string;
  capability: string;
  outcome: string;
  metrics: string;
}

export const CASE_STUDIES: CaseStudy[] = [
  {
    id: 'clinical-imaging',
    badge: 'HEALTHCARE INFRASTRUCTURE',
    title: 'Federated Clinical Diagnostic Pipeline',
    audience: 'Regional Healthcare Network · 30+ Hospitals',
    capability: 'Model Gateway + Access & Security Foundation Layers',
    outcome: 'Decoupled diagnostic inference models from on-premise PACS scanners, enabling model updates in minutes rather than quarters.',
    metrics: '94% Reduction in deployment cycle time',
  },
  {
    id: 'decision-engine',
    badge: 'ENTERPRISE GOVERNANCE',
    title: 'Deterministic Regulatory Decision System',
    audience: 'Multinational Financial Clearinghouse',
    capability: 'Decisions + Reliability & Sync Foundation Layers',
    outcome: 'Built a shared zero-trust audit stream handling millions of transactions daily with verifiable state verification.',
    metrics: '12M+ Daily audit events processed',
  },
  {
    id: 'data-harmonization',
    badge: 'RESEARCH CONSORTIUM',
    title: 'Cross-Institutional Genomic Mesh',
    audience: '10+ Academic Research Centers',
    capability: 'Data Ingestion + Experience Foundation Layers',
    outcome: 'Unified disparate patient genomic datasets across institutions while maintaining strict HIPAA tenant boundaries.',
    metrics: '100% Zero-leak data boundary compliance',
  },
];
