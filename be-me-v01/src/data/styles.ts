import type { ArtStyle, BodyBase, ViewDefinition } from './types';

/**
 * GENESIS STYLE CATALOG
 *
 * Numbering follows the supplied UI reference (01 Watercolor, 02 Cinematic 3D,
 * 04 Photorealistic, 09 Anime Battle, 13 Storybook 3D, 19 Comic Hero). The gaps
 * are intentional: the catalog is sparse because only the styles the client has
 * named are declared. No styles were invented to fill the numbering.
 *
 * Only Cinematic 3D has artwork. Every other entry is architecturally complete
 * and marked COMING SOON — enabling one is `enabled: true` plus its assets.
 */
export const ART_STYLES: ArtStyle[] = [
  {
    id: 'watercolor',
    index: '01',
    name: 'Watercolor',
    descriptor: 'Soft wash · paper grain',
    enabled: false,
  },
  {
    id: 'cinematic3d',
    index: '02',
    name: 'Cinematic 3D',
    descriptor: 'Rendered · volumetric · hero lighting',
    enabled: true,
  },
  {
    id: 'photorealistic',
    index: '04',
    name: 'Photorealistic',
    descriptor: 'Studio capture · true skin',
    enabled: false,
  },
  {
    id: 'animebattle',
    index: '09',
    name: 'Anime Battle',
    descriptor: 'Cel shaded · high energy',
    enabled: false,
  },
  {
    id: 'storybook3d',
    index: '13',
    name: 'Storybook 3D',
    descriptor: 'Warm · illustrated · gentle',
    enabled: false,
  },
  {
    id: 'comichero',
    index: '19',
    name: 'Comic Hero',
    descriptor: 'Inked line · bold colour',
    enabled: false,
  },
];

export const BODY_BASES: Array<{ id: BodyBase; label: string }> = [
  { id: 'boy', label: 'Boy' },
  { id: 'girl', label: 'Girl' },
];

/**
 * VIEWS
 *
 * FRONT is the only operational view. The others are declared so the switcher,
 * the store and the manifest already speak in terms of views.
 *
 * The turntable is deliberately NOT implemented by rotating the flat front PNG.
 * A real 360 requires a rendered image sequence; until that exists the control
 * states what it needs rather than pretending.
 */
export const VIEWS: ViewDefinition[] = [
  { id: 'front', label: 'Front', short: 'F', enabled: true, requirement: '' },
  {
    id: 'left',
    label: 'Left',
    short: 'L',
    enabled: false,
    requirement: 'Left-profile master artwork required for every layer in this style.',
  },
  {
    id: 'back',
    label: 'Back',
    short: 'B',
    enabled: false,
    requirement: 'Rear-view master artwork required for every layer in this style.',
  },
  {
    id: 'right',
    label: 'Right',
    short: 'R',
    enabled: false,
    requirement: 'Right-profile master artwork required for every layer in this style.',
  },
  {
    id: 'turntable',
    label: '360',
    short: '360',
    enabled: false,
    requirement:
      'A true 360 needs a rendered turntable sequence. This will not be faked by spinning the flat front artwork.',
  },
];

/** Style tile preview. Cinematic 3D borrows its own master; others have none. */
export function stylePreview(styleId: string, bodyBase: BodyBase): string | null {
  return styleId === 'cinematic3d' ? `/assets/cinematic3d/${bodyBase}/base/master.png` : null;
}
