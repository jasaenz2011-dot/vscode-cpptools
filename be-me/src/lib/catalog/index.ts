/**
 * The catalog: every swappable part in the studio, grouped into toolbelt trays.
 */
import type {
  AvatarConfig,
  CatalogGroup,
  CatalogItem,
  CategoryId,
  LayerSlot,
  Trait,
} from '../types';
import { EXPRESSIONS } from './faces';
import { HAIRSTYLES, HAIR_SWATCHES } from './hair';
import { HEADWEAR } from './headwear';
import { BOTTOMS, SHOES, TOPS } from './outfits';
import { BADGES, EYEWEAR, TOOLS } from './accessories';
import { BACKGROUNDS } from './backgrounds';

export { HAIR_SWATCHES };

export interface CategoryMeta {
  id: CategoryId;
  label: string;
  /** Second line on the toolbelt tab. */
  sub: string;
  accent: string;
}

export const CATEGORIES: CategoryMeta[] = [
  { id: 'crown', label: 'Hard Hats', sub: '& Hair', accent: '#f59e0b' },
  { id: 'gear', label: 'Gear', sub: '& Outfits', accent: '#2563eb' },
  { id: 'badges', label: 'Badges', sub: '& Extras', accent: '#a855f7' },
  { id: 'expressions', label: 'Faces', sub: 'Expressions', accent: '#fb923c' },
  { id: 'backgrounds', label: 'Sites', sub: 'Backgrounds', accent: '#22d3ee' },
];

export const GROUPS: CatalogGroup[] = [
  { id: 'hair', label: 'Hairstyle', category: 'crown', slot: 'hair', items: HAIRSTYLES, optional: true },
  { id: 'headwear', label: 'Headgear', category: 'crown', slot: 'headwear', items: HEADWEAR, optional: true },
  { id: 'top', label: 'Top Layer', category: 'gear', slot: 'top', items: TOPS },
  { id: 'bottom', label: 'Bottoms', category: 'gear', slot: 'bottom', items: BOTTOMS },
  { id: 'shoes', label: 'Footwear', category: 'gear', slot: 'shoes', items: SHOES },
  { id: 'eyewear', label: 'Eyewear', category: 'badges', slot: 'eyewear', items: EYEWEAR, optional: true },
  { id: 'badge', label: 'Chest Badge', category: 'badges', slot: 'badge', items: BADGES, optional: true },
  { id: 'tool', label: 'Handheld Tool', category: 'badges', slot: 'tool', items: TOOLS, optional: true },
  { id: 'expression', label: 'Expression', category: 'expressions', slot: 'expression', items: EXPRESSIONS },
  { id: 'background', label: 'Build Site', category: 'backgrounds', slot: 'background', items: BACKGROUNDS },
];

const BY_SLOT = new Map<LayerSlot, Map<string, CatalogItem>>();
for (const group of GROUPS) {
  const map = BY_SLOT.get(group.slot) ?? new Map<string, CatalogItem>();
  for (const item of group.items) map.set(item.id, item);
  BY_SLOT.set(group.slot, map);
}

export function getItem(slot: LayerSlot, id: string | null | undefined): CatalogItem | null {
  if (!id) return null;
  return BY_SLOT.get(slot)?.get(id) ?? null;
}

export function groupsForCategory(category: CategoryId): CatalogGroup[] {
  return GROUPS.filter((g) => g.category === category);
}

/** Skin tones, warm through cool, offered as a swatch strip. */
export const SKIN_TONES = [
  '#fce0c8',
  '#f8cfa8',
  '#eeb887',
  '#dd9f6b',
  '#c98350',
  '#a9663d',
  '#87502f',
  '#653a22',
  '#4a2a19',
];

export const TRAITS: Trait[] = [
  { id: 'curious-kind', label: 'Curious & Kind', blurb: 'Asks the question, then helps you find the answer.', color: '#f59e0b' },
  { id: 'bold-maker', label: 'Bold Maker', blurb: 'Cuts the first piece while everyone else is still planning.', color: '#fb923c' },
  { id: 'thoughtful-driven', label: 'Thoughtful & Driven', blurb: 'Measures twice, finishes early, helps clean up.', color: '#2563eb' },
  { id: 'wild-inventor', label: 'Wild Inventor', blurb: 'Three prototypes deep before lunch.', color: '#a855f7' },
  { id: 'steady-builder', label: 'Steady Builder', blurb: 'The one whose tower never falls over.', color: '#22c55e' },
  { id: 'bright-spark', label: 'Bright Spark', blurb: 'Ideas arrive fast and land loud.', color: '#facc15' },
  { id: 'team-anchor', label: 'Team Anchor', blurb: 'Holds the group steady when the plan wobbles.', color: '#0ea5e9' },
  { id: 'quiet-genius', label: 'Quiet Genius', blurb: 'Says little, solves everything.', color: '#94a3b8' },
  { id: 'big-hearted', label: 'Big-Hearted Fixer', blurb: 'Repairs the robot and the mood.', color: '#f43f5e' },
  { id: 'fearless-tester', label: 'Fearless Tester', blurb: 'Breaks it on purpose so it never breaks by accident.', color: '#e879f9' },
];

export function getTrait(id: string): Trait {
  return TRAITS.find((t) => t.id === id) ?? (TRAITS[0] as Trait);
}

/** The student everyone starts as: hard hat on, vest up, ready to build. */
export const DEFAULT_CONFIG: AvatarConfig = {
  grade: 3,
  skinTone: '#eeb887',
  items: {
    background: 'blueprint',
    hair: 'coils',
    headwear: 'hardhat',
    expression: 'spark',
    top: 'hivis',
    bottom: 'cargo',
    shoes: 'boots',
    eyewear: 'safety',
    badge: 'gear',
    tool: 'wrench',
  },
  colors: {},
  identity: {
    name: '',
    school: 'Maker Lab',
    traitId: 'curious-kind',
  },
};

/** Curated swatches offered by the picker before the free hex field. */
export const SWATCHES = [
  '#f59e0b',
  '#fb923c',
  '#facc15',
  '#dc2626',
  '#f43f5e',
  '#a855f7',
  '#7c3aed',
  '#2563eb',
  '#0ea5e9',
  '#22d3ee',
  '#22c55e',
  '#3f6212',
  '#f8fafc',
  '#cbd5e1',
  '#64748b',
  '#1e293b',
  '#0f172a',
  '#78350f',
];
