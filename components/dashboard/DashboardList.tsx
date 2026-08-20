"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BiodataFormValues } from "@/lib/schema";

interface BiodataRow {
  id: string;
  title: string;
  data: BiodataFormValues;
  updatedAt: string;
}

const TEMPLATE_LABEL: Record<string, string> = {
  traditional: "Traditional",
  modern: "Modern Minimal",
  botanical: "Elegant Floral",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function DashboardList({ initial }: { initial: BiodataRow[] }) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [creating, setCreating] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  async function handleCreate() {
    setCreating(true);
    try {
      const res = await fetch("/api/biodatas", { method: "POST" });
      const json = await res.json();
      router.push(`/gender?id=${json.id}`);
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    try {
      await fetch(`/api/biodatas/${id}`, { method: "DELETE" });
      setRows((r) => r.filter((row) => row.id !== id));
      setConfirmDeleteId(null);
    } finally {
      setDeletingId(null);
    }
  }

  async function handleRenameSave(id: string) {
    const title = renameValue.trim();
    if (!title) {
      setRenamingId(null);
      return;
    }
    setRows((r) => r.map((row) => (row.id === id ? { ...row, title } : row)));
    setRenamingId(null);
    await fetch(`/api/biodatas/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    }).catch(() => {});
  }

  return (
    <div className="mt-8">
      <button
        type="button"
        onClick={handleCreate}
        disabled={creating}
        className="min-h-14 rounded-2xl bg-stone-900 px-6 text-base font-semibold text-white disabled:opacity-60"
      >
        {creating ? "Creating…" : "+ New biodata"}
      </button>

      {rows.length === 0 ? (
        <p className="mt-8 text-sm text-stone-400">
          No saved biodatas yet — create one to get started.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {rows.map((row) => {
            const templateId = row.data.meta?.templateId;
            return (
              <div
                key={row.id}
                className="flex flex-col gap-3 rounded-2xl border border-stone-200 bg-white p-5"
              >
                <div>
                  {renamingId === row.id ? (
                    <input
                      autoFocus
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onBlur={() => handleRenameSave(row.id)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleRenameSave(row.id);
                        if (e.key === "Escape") setRenamingId(null);
                      }}
                      className="min-h-10 w-full rounded-lg border border-stone-300 px-2 text-base font-semibold"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setRenamingId(row.id);
                        setRenameValue(row.title);
                      }}
                      className="text-left text-base font-semibold text-stone-900 hover:underline"
                    >
                      {row.title}
                    </button>
                  )}
                  <div className="mt-1 text-xs text-stone-400">
                    {templateId ? TEMPLATE_LABEL[templateId] : "No template chosen"} · Updated{" "}
                    {formatDate(row.updatedAt)}
                  </div>
                </div>

                <div className="mt-1 flex items-center gap-4">
                  <Link
                    href={`/form?id=${row.id}`}
                    className="min-h-11 rounded-full border border-stone-900 px-4 py-1.5 text-sm font-semibold text-stone-900 hover:bg-stone-900 hover:text-white"
                  >
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => setConfirmDeleteId(row.id)}
                    className="min-h-11 text-sm font-medium text-red-700 hover:underline"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {confirmDeleteId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-stone-900">Delete this biodata?</h2>
            <p className="mt-2 text-sm text-stone-600">
              This permanently deletes it and its photo. This cannot be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setConfirmDeleteId(null)}
                className="min-h-11 flex-1 rounded-xl border border-stone-300 px-4 text-sm font-medium text-stone-700 hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(confirmDeleteId)}
                disabled={deletingId === confirmDeleteId}
                className="min-h-11 flex-1 rounded-xl bg-red-700 px-4 text-sm font-medium text-white hover:bg-red-800 disabled:opacity-60"
              >
                {deletingId === confirmDeleteId ? "Deleting…" : "Yes, delete it"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
