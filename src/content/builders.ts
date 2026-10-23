export interface BuilderNode {
  id: string;
  role: string;
  tenure: string;
  focus: string;
  description: string;
  isLead?: boolean;
}

export const BUILDERS_TIMELINE: BuilderNode[] = [
  {
    id: 'mentor',
    role: 'MENTOR',
    tenure: '10+ YEARS',
    focus: 'Foundational Systems & Security',
    description: 'Specializes in high-assurance operating primitives, threat modeling, and distributed consensus.',
    isLead: true,
  },
  {
    id: 'architect',
    role: 'ARCHITECT',
    tenure: '5+ YEARS',
    focus: 'Infrastructure & Data Meshes',
    description: 'Designs horizontally scalable streaming pipelines, multi-cloud topologies, and fault tolerance.',
  },
  {
    id: 'senior-engineer',
    role: 'SENIOR ENGINEER',
    tenure: '3+ YEARS',
    focus: 'Real-Time Graphics & Application State',
    description: 'Crafts low-latency interactive WebGL visualization, canvas pipelines, and state machines.',
  },
  {
    id: 'product-builder',
    role: 'PRODUCT BUILDER',
    tenure: '< 1 YEAR',
    focus: 'Rapid Prototyping & Integration',
    description: 'Pairs with domain product teams to test foundation abstractions against live customer requirements.',
  },
];
