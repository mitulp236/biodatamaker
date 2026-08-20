"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { AppHeader } from "@/components/layout/AppHeader";
import { useBiodataStore } from "@/lib/store";
import { defaultBiodataValues } from "@/lib/schema";

export default function LandingPage() {
  const { status } = useSession();
  const hasHydrated = useBiodataStore((s) => s.hasHydrated);
  const data = useBiodataStore((s) => s.data);
  const draftExists = hasHydrated && JSON.stringify(data) !== JSON.stringify(defaultBiodataValues);

  return (
    <>
      <AppHeader />
      <main className="mx-auto flex min-h-[calc(100vh-3.5rem)] max-w-lg flex-col justify-center px-6 py-16">
        <div className="text-center">
          <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-600">
            No account needed. Nothing saved to our servers unless you sign in.
          </div>
          <h1 className="text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
            A biodata that doesn&apos;t look like 2009 clip art.
          </h1>
          <p className="mt-4 text-base leading-relaxed text-stone-600">
            Build a print-ready marriage biodata in minutes. Without an account, your
            draft stays in your browser — we never see your details, your photo, or
            your finished PDF.
          </p>
        </div>

        <div className="mt-10 flex flex-col gap-3">
          {draftExists && (
            <Link
              href="/form"
              className="flex min-h-14 items-center justify-center rounded-2xl bg-stone-900 px-6 text-base font-semibold text-white hover:bg-stone-800"
            >
              Continue your draft
            </Link>
          )}
          <Link
            href="/gender"
            className={
              draftExists
                ? "flex min-h-14 items-center justify-center rounded-2xl border border-stone-300 px-6 text-base font-semibold text-stone-800 hover:bg-stone-100"
                : "flex min-h-14 items-center justify-center rounded-2xl bg-stone-900 px-6 text-base font-semibold text-white hover:bg-stone-800"
            }
          >
            {draftExists ? "Start a new biodata" : "Start without an account"}
          </Link>

          {status === "authenticated" ? (
            <Link
              href="/dashboard"
              className="flex min-h-14 items-center justify-center rounded-2xl border border-stone-300 px-6 text-base font-semibold text-stone-800 hover:bg-stone-100"
            >
              My saved biodatas
            </Link>
          ) : status === "unauthenticated" ? (
            <Link
              href="/signin"
              className="flex min-h-14 items-center justify-center rounded-2xl border border-stone-300 px-6 text-base font-semibold text-stone-800 hover:bg-stone-100"
            >
              Sign in to save &amp; make more than one
            </Link>
          ) : null}
        </div>

        <p className="mt-8 text-center text-xs leading-relaxed text-stone-400">
          Every field is optional. Empty fields are simply left out of your PDF — no
          blank lines, no &quot;N/A&quot;.
        </p>
      </main>
    </>
  );
}
