'use client';

/**
 * The studio store.
 *
 * `present` is the single serialisable source of truth for the avatar; `past`
 * and `future` give undo/redo. Rapid edits that belong to one gesture (dragging
 * the grade slider, scrubbing a colour, typing a name) coalesce into a single
 * history entry via `commitKey`, so undo steps map to what the student actually
 * *did* rather than to every intermediate pixel.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AssetPalette,
  AvatarConfig,
  CatalogItem,
  CategoryId,
  ColorChannel,
  GradeStep,
  IdentityMeta,
  LayerSlot,
} from './types';
import { LAYER_SLOTS } from './types';
import { DEFAULT_CONFIG, GROUPS, HAIR_SWATCHES, SKIN_TONES, SWATCHES, TRAITS } from './catalog';
import { isHex, shade } from './color';

const HISTORY_LIMIT = 80;
const COALESCE_MS = 650;

/** Ink used for every outline in the character art. */
export const INK = '#141c2b';

export interface StudioState {
  past: AvatarConfig[];
  present: AvatarConfig;
  future: AvatarConfig[];
  commitKey: string | null;
  commitAt: number;

  // UI preferences — deliberately outside the undo history.
  category: CategoryId;
  soundOn: boolean;
  gridOn: boolean;
  hydrated: boolean;

  setGrade: (grade: GradeStep) => void;
  selectItem: (slot: LayerSlot, id: string | null) => void;
  setColor: (slot: LayerSlot, channel: ColorChannel, hex: string) => void;
  resetColors: (slot: LayerSlot) => void;
  setSkinTone: (hex: string) => void;
  setIdentity: (patch: Partial<IdentityMeta>) => void;
  randomize: () => void;
  resetAll: () => void;
  loadConfig: (config: AvatarConfig) => void;
  undo: () => void;
  redo: () => void;
  setCategory: (category: CategoryId) => void;
  toggleSound: () => void;
  toggleGrid: () => void;
  markHydrated: () => void;
}

const clone = (config: AvatarConfig): AvatarConfig => ({
  ...config,
  items: { ...config.items },
  colors: Object.fromEntries(
    Object.entries(config.colors).map(([slot, channels]) => [slot, { ...channels }]),
  ),
  identity: { ...config.identity },
});

const pick = <T,>(list: readonly T[]): T => list[Math.floor(Math.random() * list.length)] as T;

export const useStudio = create<StudioState>()(
  persist(
    (set, get) => {
      /**
       * Apply a change to `present`, pushing history unless this edit continues
       * the gesture identified by `key`.
       */
      const edit = (
        mutate: (draft: AvatarConfig) => AvatarConfig,
        key: string | null = null,
      ) => {
        const state = get();
        const next = mutate(clone(state.present));
        const now = Date.now();
        const continues =
          key !== null && state.commitKey === key && now - state.commitAt < COALESCE_MS;

        set({
          present: next,
          past: continues ? state.past : [...state.past, state.present].slice(-HISTORY_LIMIT),
          future: [],
          commitKey: key,
          commitAt: now,
        });
      };

      return {
        past: [],
        present: DEFAULT_CONFIG,
        future: [],
        commitKey: null,
        commitAt: 0,
        category: 'crown',
        soundOn: false,
        gridOn: true,
        hydrated: false,

        setGrade: (grade) =>
          edit((draft) => {
            draft.grade = grade;
            return draft;
          }, 'grade'),

        selectItem: (slot, id) =>
          edit((draft) => {
            draft.items[slot] = id;
            return draft;
          }),

        setColor: (slot, channel, hex) =>
          edit(
            (draft) => {
              const next = { ...(draft.colors[slot] ?? {}) };
              next[channel] = hex;
              draft.colors = { ...draft.colors, [slot]: next };
              return draft;
            },
            `color:${slot}:${channel}`,
          ),

        resetColors: (slot) =>
          edit((draft) => {
            const colors = { ...draft.colors };
            delete colors[slot];
            draft.colors = colors;
            return draft;
          }),

        setSkinTone: (hex) =>
          edit((draft) => {
            draft.skinTone = hex;
            return draft;
          }, 'skin'),

        setIdentity: (patch) =>
          edit(
            (draft) => {
              draft.identity = { ...draft.identity, ...patch };
              return draft;
            },
            `identity:${Object.keys(patch).join(',')}`,
          ),

        randomize: () =>
          edit((draft) => {
            for (const group of GROUPS) {
              if (group.slot === 'background') continue;
              const canSkip = group.optional === true && Math.random() < 0.22;
              draft.items[group.slot] = canSkip ? null : (pick(group.items) as CatalogItem).id;
            }
            draft.skinTone = pick(SKIN_TONES);
            draft.identity = { ...draft.identity, traitId: pick(TRAITS).id };
            draft.colors = {
              hair: { primary: pick(HAIR_SWATCHES), accent: pick(HAIR_SWATCHES) },
              top: { primary: pick(SWATCHES) },
              bottom: { primary: pick(SWATCHES) },
            };
            return draft;
          }),

        resetAll: () => edit(() => clone(DEFAULT_CONFIG)),

        loadConfig: (config) => edit(() => clone(config)),

        undo: () => {
          const { past, present, future } = get();
          const previous = past[past.length - 1];
          if (!previous) return;
          set({
            past: past.slice(0, -1),
            present: previous,
            future: [present, ...future].slice(0, HISTORY_LIMIT),
            commitKey: null,
            commitAt: 0,
          });
        },

        redo: () => {
          const { past, present, future } = get();
          const next = future[0];
          if (!next) return;
          set({
            past: [...past, present].slice(-HISTORY_LIMIT),
            present: next,
            future: future.slice(1),
            commitKey: null,
            commitAt: 0,
          });
        },

        setCategory: (category) => set({ category }),
        toggleSound: () => set({ soundOn: !get().soundOn }),
        toggleGrid: () => set({ gridOn: !get().gridOn }),
        markHydrated: () => set({ hydrated: true }),
      };
    },
    {
      name: 'be-me-studio-v1',
      version: 1,
      // Hydration is triggered manually after mount so the first client render
      // matches the server render exactly — no hydration mismatch, ever.
      skipHydration: true,
      partialize: (state) => ({
        present: state.present,
        soundOn: state.soundOn,
        gridOn: state.gridOn,
      }),
      merge: (persisted, current) => {
        const saved = persisted as Partial<StudioState> | undefined;
        return {
          ...current,
          ...(saved?.present ? { present: sanitizeConfig(saved.present) } : {}),
          ...(typeof saved?.soundOn === 'boolean' ? { soundOn: saved.soundOn } : {}),
          ...(typeof saved?.gridOn === 'boolean' ? { gridOn: saved.gridOn } : {}),
        };
      },
    },
  ),
);

/* ------------------------------- selectors ------------------------------- */

export const selectPresent = (state: StudioState) => state.present;
export const selectGrade = (state: StudioState) => state.present.grade;
export const selectCanUndo = (state: StudioState) => state.past.length > 0;
export const selectCanRedo = (state: StudioState) => state.future.length > 0;

/**
 * Resolve the palette an asset renders with: item defaults, overridden by any
 * hex the student picked, plus the shared skin/ink channels.
 */
export function paletteFor(
  config: AvatarConfig,
  item: CatalogItem | null,
  fallback?: Partial<AssetPalette>,
): AssetPalette {
  const overrides = item ? (config.colors[item.slot] ?? {}) : {};
  const defaults = item?.defaults ?? {};
  return {
    primary: overrides.primary ?? defaults.primary ?? fallback?.primary ?? '#f59e0b',
    secondary: overrides.secondary ?? defaults.secondary ?? fallback?.secondary ?? '#1e293b',
    accent: overrides.accent ?? defaults.accent ?? fallback?.accent ?? '#2563eb',
    skin: config.skinTone,
    skinShade: shade(config.skinTone, 0.22),
    line: INK,
  };
}

/** The colour currently shown on a swatch button for `slot`/`channel`. */
export function colorFor(
  config: AvatarConfig,
  item: CatalogItem,
  channel: ColorChannel,
): string {
  return config.colors[item.slot]?.[channel] ?? item.defaults[channel] ?? '#f59e0b';
}

/* ------------------------------- validation ------------------------------ */

const SLOT_SET = new Set<string>(LAYER_SLOTS);
const VALID_IDS = new Map<LayerSlot, Set<string>>(
  GROUPS.map((g) => [g.slot, new Set(g.items.map((i) => i.id))] as const),
);

/**
 * Coerce anything that claims to be an `AvatarConfig` — a pasted JSON file, a
 * stale localStorage payload — into something the renderer can trust.
 */
export function sanitizeConfig(input: unknown): AvatarConfig {
  const raw = (input ?? {}) as Partial<AvatarConfig>;
  const base = clone(DEFAULT_CONFIG);

  if (typeof raw.grade === 'number' && Number.isFinite(raw.grade)) {
    base.grade = Math.min(8, Math.max(0, Math.round(raw.grade))) as GradeStep;
  }
  if (typeof raw.skinTone === 'string' && isHex(raw.skinTone)) {
    base.skinTone = raw.skinTone;
  }

  if (raw.items && typeof raw.items === 'object') {
    for (const [slot, id] of Object.entries(raw.items)) {
      if (!SLOT_SET.has(slot)) continue;
      const key = slot as LayerSlot;
      if (id === null) {
        base.items[key] = null;
      } else if (typeof id === 'string' && VALID_IDS.get(key)?.has(id)) {
        base.items[key] = id;
      }
    }
  }

  if (raw.colors && typeof raw.colors === 'object') {
    const colors: AvatarConfig['colors'] = {};
    for (const [slot, channels] of Object.entries(raw.colors)) {
      if (!SLOT_SET.has(slot) || !channels || typeof channels !== 'object') continue;
      const clean: Record<string, string> = {};
      for (const [channel, hex] of Object.entries(channels as Record<string, unknown>)) {
        if (
          (channel === 'primary' || channel === 'secondary' || channel === 'accent') &&
          typeof hex === 'string' &&
          isHex(hex)
        ) {
          clean[channel] = hex;
        }
      }
      if (Object.keys(clean).length > 0) colors[slot as LayerSlot] = clean;
    }
    base.colors = colors;
  }

  if (raw.identity && typeof raw.identity === 'object') {
    const id = raw.identity as Partial<IdentityMeta>;
    if (typeof id.name === 'string') base.identity.name = id.name.slice(0, 28);
    if (typeof id.school === 'string') base.identity.school = id.school.slice(0, 32);
    if (typeof id.traitId === 'string' && TRAITS.some((t) => t.id === id.traitId)) {
      base.identity.traitId = id.traitId;
    }
  }

  return base;
}
