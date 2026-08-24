/**
 * Core domain types for the Be ME! avatar studio.
 *
 * Everything the studio renders is derived from a single serialisable
 * `AvatarConfig`. That makes undo/redo, JSON export and PNG rendering all
 * operate on the same source of truth.
 */

/** Grade steps: 0 = Kindergarten … 8 = 8th grade. */
export type GradeStep = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

/** Every swappable slot on the avatar. Order here is not render order. */
export const LAYER_SLOTS = [
  'background',
  'hair',
  'headwear',
  'expression',
  'top',
  'bottom',
  'shoes',
  'eyewear',
  'badge',
  'tool',
] as const;

export type LayerSlot = (typeof LAYER_SLOTS)[number];

/** Toolbelt tabs. Each catalog group belongs to exactly one tab. */
export const CATEGORY_IDS = [
  'crown',
  'gear',
  'badges',
  'expressions',
  'backgrounds',
] as const;

export type CategoryId = (typeof CATEGORY_IDS)[number];

/** A recolourable channel on an item, mapped to a hex value by the user. */
export type ColorChannel = 'primary' | 'secondary' | 'accent';

/** Hex colour overrides, per slot, per channel. */
export type ColorOverrides = Partial<
  Record<LayerSlot, Partial<Record<ColorChannel, string>>>
>;

export interface IdentityMeta {
  /** Student display name printed on the badge. */
  name: string;
  /** School / maker lab branding stamp. */
  school: string;
  /** Id of the selected trait from `TRAITS`. */
  traitId: string;
}

export interface AvatarConfig {
  grade: GradeStep;
  skinTone: string;
  /** Selected item id for each slot. `null` means "nothing equipped". */
  items: Record<LayerSlot, string | null>;
  colors: ColorOverrides;
  identity: IdentityMeta;
}

/**
 * Palette an asset receives at render time. Assets never reach into the store;
 * they are pure functions of these props, which keeps them memoisable.
 */
export interface AssetPalette {
  primary: string;
  secondary: string;
  accent: string;
  skin: string;
  /** Darker shade of `skin`, precomputed for shadows under hair/hats. */
  skinShade: string;
  line: string;
}

export interface AssetProps {
  palette: AssetPalette;
  /** 0 → 1 growth factor, for assets that subtly restyle as the student grows. */
  t: number;
  /** Only set for limb pieces, so sleeves/trousers can mirror. */
  side?: 'left' | 'right';
}

export type AssetComponent = (props: AssetProps) => React.ReactElement | null;

/**
 * The coordinate space an asset is authored in. The compositor places assets by
 * transforming these spaces onto the rig, so an asset never needs to know the
 * student's grade to stay anchored.
 */
export type AnchorSpace =
  | 'head' // 100×100 box centred on the skull, origin at head centre
  | 'face' // same as head, drawn after skin shading
  | 'torso' // 100 wide × 120 tall, origin at the neck notch, +y downwards
  | 'hips' // 100 wide × 100 tall, origin at hip centre
  | 'feet' // 100 wide × 40 tall, origin between the ankles
  | 'hand' // 40×40 box centred on the right fist
  | 'chest' // 100×100 box centred on the sternum (badges/patches)
  | 'canvas'; // raw 0 0 `STAGE_W` `STAGE_H` viewBox, for backgrounds

export interface CatalogItem {
  id: string;
  label: string;
  slot: LayerSlot;
  anchor: AnchorSpace;
  Asset: AssetComponent;
  /**
   * Optional second piece drawn *inside* each limb group, so sleeves and
   * trouser legs inherit the limb's exact rotation and can never drift away
   * from the arm or leg they belong to.
   */
  LimbAsset?: AssetComponent;
  limbTarget?: 'arms' | 'legs';
  /**
   * Optional piece drawn in the same anchor space but *behind* the whole body,
   * for long hair, capes and anything that falls down the student's back.
   */
  BackAsset?: AssetComponent;
  /** Channels the user may recolour for this item, in swatch order. */
  channels: ColorChannel[];
  /** Default hex per channel, used until the student overrides it. */
  defaults: Partial<Record<ColorChannel, string>>;
  /** Rendered behind the head/body instead of in front (e.g. long hair). */
  behind?: boolean;
  /** Short flavour text shown in the tray tooltip. */
  blurb?: string;
}

export interface CatalogGroup {
  id: string;
  label: string;
  category: CategoryId;
  slot: LayerSlot;
  items: CatalogItem[];
  /** When true the tray offers a "none" chip to clear the slot. */
  optional?: boolean;
}

export interface Trait {
  id: string;
  label: string;
  blurb: string;
  color: string;
}
