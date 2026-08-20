import { signIn } from "@/auth";

export default function SignInPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-6 py-16">
      <h1 className="text-center text-2xl font-semibold text-stone-900">Sign in</h1>
      <p className="mt-2 text-center text-sm text-stone-500">
        Sign in to save multiple biodatas and edit them later.
      </p>

      <form
        className="mt-8"
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/dashboard" });
        }}
      >
        <button
          type="submit"
          className="flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl border border-stone-300 bg-white px-6 text-base font-semibold text-stone-800 hover:bg-stone-50"
        >
          <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8 3l5.7-5.7C34.5 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
            <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.1 18.9 12 24 12c3.1 0 5.9 1.1 8 3l5.7-5.7C34.5 6.1 29.5 4 24 4c-7.6 0-14.1 4.3-17.4 10.7z" />
            <path fill="#4CAF50" d="M24 44c5.4 0 10.3-2.1 14-5.5l-6.5-5.4c-2 1.4-4.6 2.3-7.5 2.3-5.3 0-9.7-3.4-11.3-8l-6.6 5.1C9.8 39.6 16.4 44 24 44z" />
            <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.3-2.2 4.2-4 5.6l6.5 5.4C41.5 36 44 30.5 44 24c0-1.3-.1-2.7-.4-3.5z" />
          </svg>
          Continue with Google
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-stone-400">
        No account needed to make a biodata — sign in is only for saving drafts
        across devices and keeping more than one biodata.
      </p>
    </main>
  );
}
