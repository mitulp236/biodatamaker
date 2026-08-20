"use client";

import { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import { BiodataView } from "@/lib/biodataView";
import { TemplateId } from "@/lib/schema";
import { BiodataDocument, pdfFileName } from "./BiodataDocument";

export function DownloadButton({
  view,
  templateId,
  fullName,
  className = "",
}: {
  view: BiodataView;
  templateId: TemplateId;
  fullName?: string;
  className?: string;
}) {
  const [generating, setGenerating] = useState(false);

  async function handleDownload() {
    setGenerating(true);
    try {
      const blob = await pdf(<BiodataDocument view={view} templateId={templateId} />).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = pdfFileName(fullName);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setGenerating(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={generating}
      className={`min-h-14 rounded-xl bg-stone-900 text-base font-semibold text-white disabled:opacity-60 ${className}`}
    >
      {generating ? "Preparing PDF…" : "Download PDF"}
    </button>
  );
}
