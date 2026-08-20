"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBiodataStore } from "@/lib/store";

export function ClearDataButton() {
  const [confirming, setConfirming] = useState(false);
  const clearAll = useBiodataStore((s) => s.clearAll);
  const router = useRouter();

  function handleClear() {
    clearAll();
    setConfirming(false);
    router.push("/");
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        className="min-h-11 text-sm font-medium text-stone-500 hover:text-red-700 transition-colors"
      >
        Clear all my data
      </button>

      {confirming && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-stone-900">Clear all your data?</h2>
            <p className="mt-2 text-sm text-stone-600">
              This deletes your draft, photo, and all entered details from this browser.
              This cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setConfirming(false)}
                className="min-h-11 flex-1 rounded-xl border border-stone-300 px-4 text-sm font-medium text-stone-700 hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClear}
                className="min-h-11 flex-1 rounded-xl bg-red-700 px-4 text-sm font-medium text-white hover:bg-red-800"
              >
                Yes, clear it
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
