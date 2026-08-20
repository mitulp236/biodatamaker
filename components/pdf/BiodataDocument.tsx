import React from "react";
import { Document } from "@react-pdf/renderer";
import { BiodataView } from "@/lib/biodataView";
import { TemplateId } from "@/lib/schema";
import { registerPdfFonts } from "@/lib/pdf/fonts";
import { TraditionalPdf } from "./TraditionalPdf";
import { ModernPdf } from "./ModernPdf";
import { BotanicalPdf } from "./BotanicalPdf";

registerPdfFonts();

export function BiodataDocument({
  view,
  templateId,
}: {
  view: BiodataView;
  templateId: TemplateId;
}) {
  return (
    <Document title={`Biodata - ${view.name}`}>
      {templateId === "traditional" && <TraditionalPdf view={view} />}
      {templateId === "modern" && <ModernPdf view={view} />}
      {templateId === "botanical" && <BotanicalPdf view={view} />}
    </Document>
  );
}

export function pdfFileName(fullName: string | undefined): string {
  const first = (fullName ?? "").trim().split(/\s+/)[0];
  const safe = (first || "Biodata").replace(/[^a-zA-Z0-9]/g, "");
  return `Biodata_${safe || "Draft"}.pdf`;
}
