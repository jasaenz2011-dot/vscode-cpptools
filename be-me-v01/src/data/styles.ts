import type { ArtStyle, BodyBase, ViewDefinition } from './types';

/**
 * ART STYLES
 *
 * All five exist in the data model from day one. Only Cinematic 3D is
 * operational; the rest are architecturally complete and marked COMING SOON so
 * that enabling one is a single `enabled: true` plus its asset directory.
 */
export const ART_STYLES: ArtStyle[] = [
  {
    id: 'cinematic3d',
    index: '01',
    name: 'Cinematic 3D',
    descriptor: 'Rendered · volumetric · hero lighting',
    enabled: true,
  },
  {
    id: 'watercolor',
    index: '02',
    name: 'Watercolor',
    descriptor: 'Soft wash · paper grain',
    enabled: false,
  },
  {
    id: 'comic',
    index: '03',
    name: 'Comic',
    descriptor: 'Inked line · flat colour',
    enabled: false,
  },
  {
    id: 'anime',
    index: '04',
    name: 'Anime',
    descriptor: 'Cel shaded · expressive',
    enabled: false,
  },
  {
    id: 'realistic',
    index: '05',
    name: 'Realistic',
    descriptor: 'Photoreal · studio capture',
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
 * FRONT is the only operational view in v0.1. The others are declared so the
 * switcher, the store and the manifest already speak in terms of views.
 *
 * The turntable is deliberately NOT implemented by rotating the flat front PNG.
 * A real turntable requires a rendered image sequence; until that exists the
 * control states plainly what it needs.
 */
export const VIEWS: ViewDefinition[] = [
  {
    id: 'front',
    label: 'Front',
    short: 'F',
    enabled: true,
    requirement: '',
  },
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
