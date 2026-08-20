"use client";

import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { useActiveBiodata } from "@/hooks/useActiveBiodata";
import { genderOptions } from "@/lib/schema";

export default function GenderSelectPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const router = useRouter();
  const id = searchParams.id ?? null;
  const qs = id ? `?id=${id}` : "";
  const { patch, data } = useActiveBiodata(id);

  function choose(gender: (typeof genderOptions)[number]) {
    patch({ meta: { ...data.meta, gender } });
    router.push(`/templates${qs}`);
  }

  return (
    <>
      <AppHeader />
      <main className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-lg flex-col justify-center px-6 py-12">
        <h1 className="text-center text-2xl font-semibold text-stone-900">
          Who is this biodata for?
        </h1>
        <p className="mt-2 text-center text-sm text-stone-500">
          This only sets pronouns and the default template order — you can change
          any detail later.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {genderOptions.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => choose(g)}
              className="flex min-h-24 flex-col items-center justify-center gap-1 rounded-2xl border-2 border-stone-200 bg-white p-6 text-center transition-colors hover:border-stone-900"
            >
              <span className="text-lg font-semibold text-stone-900">{g}</span>
            </button>
          ))}
        </div>
      </main>
    </>
  );
}
