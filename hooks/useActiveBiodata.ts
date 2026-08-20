"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useBiodataStore } from "@/lib/store";
import { BiodataFormValues, defaultBiodataValues } from "@/lib/schema";

export interface ActiveBiodata {
  mode: "local" | "remote";
  biodataId: string | null;
  data: BiodataFormValues;
  hasHydrated: boolean;
  setData: (data: BiodataFormValues) => void;
  patch: (partial: Partial<BiodataFormValues>) => void;
}

function useRemoteBiodata(id: string | null): ActiveBiodata {
  const router = useRouter();
  const [data, setDataState] = useState<BiodataFormValues>(defaultBiodataValues);
  const [hasHydrated, setHasHydrated] = useState(false);
  const loadedIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (!id || loadedIdRef.current === id) return;
    loadedIdRef.current = id;
    setHasHydrated(false);

    fetch(`/api/biodatas/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          router.replace("/dashboard");
          return;
        }
        const json = await res.json();
        setDataState(json.data as BiodataFormValues);
        setHasHydrated(true);
      })
      .catch(() => router.replace("/dashboard"));
  }, [id, router]);

  const persist = useCallback(
    (next: BiodataFormValues) => {
      if (!id) return;
      fetch(`/api/biodatas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: next }),
      }).catch(() => {});
    },
    [id]
  );

  const setData = useCallback(
    (next: BiodataFormValues) => {
      setDataState(next);
      persist(next);
    },
    [persist]
  );

  const patch = useCallback(
    (partial: Partial<BiodataFormValues>) => {
      setDataState((prev) => {
        const next = { ...prev, ...partial };
        persist(next);
        return next;
      });
    },
    [persist]
  );

  return { mode: "remote", biodataId: id, data, hasHydrated, setData, patch };
}

function useLocalBiodata(): ActiveBiodata {
  const data = useBiodataStore((s) => s.data);
  const hasHydrated = useBiodataStore((s) => s.hasHydrated);
  const setData = useBiodataStore((s) => s.setData);
  const patch = useBiodataStore((s) => s.patch);

  return { mode: "local", biodataId: null, data, hasHydrated, setData, patch };
}

/**
 * Unifies the two persistence backends behind one interface: a truthy `id`
 * (the page's `?id=` search param, passed in by the caller) means
 * "signed-in, saved to the server"; `null` means the original anonymous,
 * browser-only draft. Both hooks are always called (rules of hooks) — only
 * the active one's result is returned. `id` is taken as a plain parameter
 * (not read via useSearchParams) so callers can source it from the page's
 * server-provided `searchParams` prop and avoid a Suspense boundary.
 */
export function useActiveBiodata(id: string | null): ActiveBiodata {
  const local = useLocalBiodata();
  const remote = useRemoteBiodata(id);

  return id ? remote : local;
}
