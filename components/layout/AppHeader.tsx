"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { ClearDataButton } from "./ClearDataButton";

export function AppHeader() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-stone-200 bg-stone-50/95 px-4 backdrop-blur sm:px-6">
      <Link href="/" className="text-base font-semibold tracking-tight text-stone-900">
        Biodata Maker
      </Link>

      <nav className="flex items-center gap-4">
        {status === "authenticated" ? (
          <>
            <Link
              href="/dashboard"
              className="hidden text-sm font-medium text-stone-600 hover:text-stone-900 sm:inline"
            >
              My Biodatas
            </Link>
            <div className="flex items-center gap-2">
              {session.user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={session.user.image}
                  alt=""
                  className="h-7 w-7 rounded-full border border-stone-200"
                />
              ) : (
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-stone-200 text-xs font-semibold text-stone-600">
                  {(session.user?.name ?? "?").charAt(0).toUpperCase()}
                </div>
              )}
              <span className="hidden text-sm font-medium text-stone-700 sm:inline">
                {session.user?.name}
              </span>
            </div>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="min-h-11 text-sm font-medium text-stone-500 hover:text-stone-900"
            >
              Sign out
            </button>
          </>
        ) : status === "unauthenticated" ? (
          <>
            <ClearDataButton />
            <Link
              href="/signin"
              className="flex min-h-9 items-center rounded-full border border-stone-300 px-3.5 text-sm font-medium text-stone-700 hover:border-stone-900"
            >
              Sign in
            </Link>
          </>
        ) : (
          <div className="h-7 w-24" aria-hidden="true" />
        )}
      </nav>
    </header>
  );
}
