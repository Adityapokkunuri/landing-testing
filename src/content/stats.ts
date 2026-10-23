export interface StatItem {
  id: string;
  value: string;
  label: string;
  description: string;
  icon: 'cube' | 'hospital' | 'pillars';
}

export const STATS: StatItem[] = [
  {
    id: 'builds',
    value: '50+',
    label: 'BUILDS',
    description: 'Production applications and services deployed across enterprise product teams.',
    icon: 'cube',
  },
  {
    id: 'hospitals',
    value: '30+',
    label: 'HOSPITALS',
    description: 'Clinical facilities and health networks running on shared foundational infrastructure.',
    icon: 'hospital',
  },
  {
    id: 'institutions',
    value: '10+',
    label: 'INSTITUTIONS',
    description: 'Research universities and academic healthcare institutions building together.',
    icon: 'pillars',
  },
];
