/**
 * LAYER STACK
 * ===========
 *
 * The compositing order of the avatar, bottom to top. Every entry is a slot on
 * the master canvas; the manifest supplies which asset currently fills it.
 *
 * Order here is the only place render order is defined — the renderer walks
 * this array, so re-ordering the stack is a one-line change.
 */

export const LAYER_SLOTS = [
  'base',
  'skin',
  'bottom',
  'top',
  'shoes',
  'eyes',
  'eyebrows',
  'hair',
  'accessories',
] as const;

export type LayerSlot = (typeof LAYER_SLOTS)[number];

/**
 * The customisation categories offered in the right-hand panel, in display
 * order. `skin` reads as a category to the user but maps to the `skin` slot.
 */
export const CUSTOMIZE_CATEGORIES = [
  'skin',
  'hair',
  'eyes',
  'eyebrows',
  'top',
  'bottom',
  'shoes',
  'accessories',
] as const satisfies readonly LayerSlot[];

export type CustomizeCategory = (typeof CUSTOMIZE_CATEGORIES)[number];

export const CATEGORY_LABELS: Record<CustomizeCategory, string> = {
  skin: 'Skin',
  hair: 'Hair',
  eyes: 'Eyes',
  eyebrows: 'Eyebrows',
  top: 'Tops',
  bottom: 'Bottoms',
  shoes: 'Shoes',
  accessories: 'Accessories',
};

/** Compact labels for the icon rail, where the full name will not fit. */
export const CATEGORY_SHORT: Record<CustomizeCategory, string> = {
  skin: 'Skin',
  hair: 'Hair',
  eyes: 'Eyes',
  eyebrows: 'Brows',
  top: 'Tops',
  bottom: 'Bottoms',
  shoes: 'Shoes',
  accessories: 'Extras',
};

/** Directory name on disk for each slot, under `assets/<style>/<bodyBase>/`. */
export const SLOT_DIRECTORIES: Record<LayerSlot, string> = {
  base: 'base',
  skin: 'skin',
  eyes: 'eyes',
  eyebrows: 'eyebrows',
  hair: 'hair',
  top: 'tops',
  bottom: 'bottoms',
  shoes: 'shoes',
  accessories: 'accessories',
};

/** Slots the student may leave empty. `base` and `skin` are never optional. */
export const OPTIONAL_SLOTS: ReadonlySet<LayerSlot> = new Set<LayerSlot>([
  'accessories',
]);
