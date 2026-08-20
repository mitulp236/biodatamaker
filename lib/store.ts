"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { BiodataFormValues, defaultBiodataValues } from "./schema";

export const DRAFT_STORAGE_KEY = "biodata-maker:draft:v1";

interface BiodataStore {
  data: BiodataFormValues;
  hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;
  setData: (data: BiodataFormValues) => void;
  patch: (partial: Partial<BiodataFormValues>) => void;
  clearAll: () => void;
}

export const useBiodataStore = create<BiodataStore>()(
  persist(
    (set) => ({
      data: defaultBiodataValues,
      hasHydrated: false,
      setHasHydrated: (v) => set({ hasHydrated: v }),
      setData: (data) => set({ data }),
      patch: (partial) =>
        set((state) => ({ data: { ...state.data, ...partial } })),
      clearAll: () => set({ data: defaultBiodataValues }),
    }),
    {
      name: DRAFT_STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);

/** Returns the local draft's data if one exists and has any real content, else null. */
export function readNonEmptyDraft(): BiodataFormValues | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    const d = parsed?.state?.data;
    if (!d) return null;
    return JSON.stringify(d) !== JSON.stringify(defaultBiodataValues) ? d : null;
  } catch {
    return null;
  }
}

export function hasExistingDraft(): boolean {
  return readNonEmptyDraft() !== null;
}

export function clearDraftStorage() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(DRAFT_STORAGE_KEY);
  } catch {
    // ignore quota/security errors
  }
}
