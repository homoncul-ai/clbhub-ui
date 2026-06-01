export interface CareerLadder {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export const CAREER_LADDERS: CareerLadder[] = [
  { id: 'daycare', name: 'Daycare & Early Childhood', icon: 'fas fa-baby', description: 'Babysitting \u2192 owning a daycare in MA' },
  { id: 'barbering', name: 'Barbering', icon: 'fas fa-cut', description: 'Practice \u2192 licensed barber \u2192 shop owner' },
  { id: 'construction', name: 'Construction Trades', icon: 'fas fa-hard-hat', description: 'Helper \u2192 journeyman \u2192 contractor' },
  { id: 'auto', name: 'Auto Mechanic', icon: 'fas fa-car', description: 'Lot helper \u2192 ASE tech \u2192 shop owner' },
  { id: 'plumber', name: 'Plumber', icon: 'fas fa-wrench', description: 'Helper \u2192 apprentice \u2192 master \u2192 contractor' },
  { id: 'healthcare', name: 'Healthcare Aide', icon: 'fas fa-heartbeat', description: 'HHA \u2192 CNA \u2192 LPN \u2192 RN \u2192 NP' },
  { id: 'food', name: 'Food Service', icon: 'fas fa-utensils', description: 'Line cook \u2192 chef \u2192 restaurant owner' },
  { id: 'logistics', name: 'Logistics & Driving', icon: 'fas fa-truck', description: 'Delivery \u2192 CDL \u2192 owner-operator \u2192 fleet' },
  { id: 'cleaning', name: 'Cleaning Services', icon: 'fas fa-broom', description: 'Cleaner \u2192 specialty tech \u2192 crew lead \u2192 owner' },
  { id: 'cosmetology', name: 'Cosmetology', icon: 'fas fa-paint-brush', description: 'Assistant \u2192 licensed \u2192 independent \u2192 salon owner' },
];
