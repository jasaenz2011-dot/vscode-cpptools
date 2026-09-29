import { create } from 'zustand';
import { CUSTOMIZE_CATEGORIES, type CustomizeCategory, type LayerSlot } from '../config/layers';
import type { ArtStyleId, BodyBase, ViewId } from '../data/types';
import type { ManifestIndex } from '../engine/manifest';

/** Everything that defines one saved avatar. */
export interface AvatarConfig {
  style: ArtStyleId;
  bodyBase: BodyBase;
  selection: Record<CustomizeCategory, string | null>;
}

export interface SavedAvatar {
  id: string;
  name: string;
  savedAt: number;
  config: AvatarConfig;
}

const EMPTY_SELECTION = Object.fromEntries(
  CUSTOMIZE_CATEGORIES.map((c) => [c, null]),
) as Record<CustomizeCategory, string | null>;

export const DEFAULT_CONFIG: AvatarConfig = {
  style: 'cinematic3d',
  bodyBase: 'boy',
  selection: { ...EMPTY_SELECTION },
};

const STORAGE_KEY = 'be-me:v0.1';

interface PersistShape {
  current: AvatarConfig;
  saved: SavedAvatar[];
}

function readStorage(): PersistShape | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistShape;
    if (!parsed?.current || !Array.isArray(parsed.saved)) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeStorage(shape: PersistShape): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(shape));
  } catch {
    /* Storage may be unavailable (private mode); the prototype still runs. */
  }
}

export interface StudioState {
  config: AvatarConfig;
  saved: SavedAvatar[];
  view: ViewId;
  activeCategory: CustomizeCategory;
  /** Id of the currently loaded saved avatar, if any. */
  loadedId: string | null;
  toast: { message: string; tone: 'ok' | 'warn' } | null;

  setStyle: (style: ArtStyleId) => void;
  setBodyBase: (base: BodyBase) => void;
  setView: (view: ViewId) => void;
  setCategory: (category: CustomizeCategory) => void;
  select: (slot: CustomizeCategory, assetId: string | null) => void;

  reset: () => void;
  newAvatar: () => void;
  randomize: (manifest: ManifestIndex) => void;

  saveAvatar: (name: string) => void;
  loadAvatar: (id: string) => void;
  deleteAvatar: (id: string) => void;

  hydrate: () => void;
  showToast: (message: string, tone?: 'ok' | 'warn') => void;
  clearToast: () => void;
}

export const useStudio = create<StudioState>((set, get) => {
  const persist = () => {
    const { config, saved } = get();
    writeStorage({ current: config, saved });
  };

  return {
    config: DEFAULT_CONFIG,
    saved: [],
    view: 'front',
    activeCategory: 'skin',
    loadedId: null,
    toast: null,

    setStyle: (style) => {
      set((s) => ({ config: { ...s.config, style }, loadedId: null }));
      persist();
    },

    setBodyBase: (bodyBase) => {
      // Selections are per body base, so switching starts that base clean
      // rather than pointing at ids that belong to the other character.
      set((s) => ({
        config: { ...s.config, bodyBase, selection: { ...EMPTY_SELECTION } },
        loadedId: null,
      }));
      persist();
    },

    setView: (view) => set({ view }),
    setCategory: (activeCategory) => set({ activeCategory }),

    select: (slot, assetId) => {
      set((s) => ({
        config: { ...s.config, selection: { ...s.config.selection, [slot]: assetId } },
        loadedId: null,
      }));
      persist();
    },

    reset: () => {
      set((s) => ({
        config: { ...s.config, selection: { ...EMPTY_SELECTION } },
        loadedId: null,
        toast: { message: 'Customisation reset to the master base.', tone: 'ok' },
      }));
      persist();
    },

    newAvatar: () => {
      set({
        config: { ...DEFAULT_CONFIG, selection: { ...EMPTY_SELECTION } },
        loadedId: null,
        view: 'front',
        toast: { message: 'New avatar started.', tone: 'ok' },
      });
      persist();
    },

    randomize: (manifest) => {
      const { style, bodyBase } = get().config;
      const selection = { ...EMPTY_SELECTION };
      for (const category of CUSTOMIZE_CATEGORIES) {
        const options = manifest.list(style, bodyBase, category as LayerSlot);
        if (options.length === 0) continue;
        // Accessories are allowed to come up empty; everything else is filled.
        if (category === 'accessories' && Math.random() < 0.35) continue;
        const pick = options[Math.floor(Math.random() * options.length)];
        selection[category] = pick ? pick.id : null;
      }
      set((s) => ({
        config: { ...s.config, selection },
        loadedId: null,
        toast: { message: 'Randomised from enabled assets.', tone: 'ok' },
      }));
      persist();
    },

    saveAvatar: (name) => {
      const trimmed = name.trim() || `Avatar ${get().saved.length + 1}`;
      const entry: SavedAvatar = {
        id: `av_${Date.now().toString(36)}`,
        name: trimmed.slice(0, 40),
        savedAt: Date.now(),
        config: structuredClone(get().config),
      };
      set((s) => ({
        saved: [entry, ...s.saved].slice(0, 50),
        loadedId: entry.id,
        toast: { message: `Saved “${entry.name}”.`, tone: 'ok' },
      }));
      persist();
    },

    loadAvatar: (id) => {
      const entry = get().saved.find((a) => a.id === id);
      if (!entry) {
        set({ toast: { message: 'That avatar is no longer stored.', tone: 'warn' } });
        return;
      }
      set({
        config: structuredClone(entry.config),
        loadedId: entry.id,
        toast: { message: `Loaded “${entry.name}”.`, tone: 'ok' },
      });
      persist();
    },

    deleteAvatar: (id) => {
      set((s) => ({
        saved: s.saved.filter((a) => a.id !== id),
        loadedId: s.loadedId === id ? null : s.loadedId,
      }));
      persist();
    },

    hydrate: () => {
      const stored = readStorage();
      if (!stored) return;
      set({
        config: { ...DEFAULT_CONFIG, ...stored.current, selection: { ...EMPTY_SELECTION, ...stored.current.selection } },
        saved: stored.saved,
      });
    },

    showToast: (message, tone = 'ok') => set({ toast: { message, tone } }),
    clearToast: () => set({ toast: null }),
  };
});
