"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { readNonEmptyDraft, clearDraftStorage } from "@/lib/store";

/**
 * Runs once when a signed-in user lands on the dashboard: if this browser
 * still has an anonymous local draft, save it as a real biodata for their
 * account, drop the local copy, and take them straight into editing it.
 */
export function DraftMigrationGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [migrating, setMigrating] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const draft = readNonEmptyDraft();
    if (!draft) {
      setChecked(true);
      return;
    }

    setMigrating(true);
    fetch("/api/biodatas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: draft }),
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Migration failed");
        const json = await res.json();
        clearDraftStorage();
        router.replace(`/form?id=${json.id}`);
      })
      .catch(() => {
        setMigrating(false);
        setChecked(true);
      });
  }, [router]);

  if (migrating) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center text-sm text-stone-400">
        Saving your draft to your account…
      </div>
    );
  }

  if (!checked) return null;

  return <>{children}</>;
}
