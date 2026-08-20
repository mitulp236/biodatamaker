import React from "react";
import { BiodataView } from "@/lib/biodataView";
import { TemplateId } from "@/lib/schema";
import { PreviewTraditional } from "./PreviewTraditional";
import { PreviewModern } from "./PreviewModern";
import { PreviewBotanical } from "./PreviewBotanical";

export function BiodataPreview({
  view,
  templateId,
}: {
  view: BiodataView;
  templateId: TemplateId | undefined;
}) {
  if (templateId === "modern") return <PreviewModern view={view} />;
  if (templateId === "botanical") return <PreviewBotanical view={view} />;
  return <PreviewTraditional view={view} />;
}
