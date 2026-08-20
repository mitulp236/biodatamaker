import React from "react";
import { BiodataView } from "@/lib/biodataView";
import { A4Page } from "./A4Page";
import { PreviewFieldSection } from "./PreviewFieldSection";

const TEAL = "#1F4E4A";
const INK = "#1B1B1A";
const BG = "#FBFAF8";
const RULE = "#D8D4CC";

export function PreviewModern({ view }: { view: BiodataView }) {
  return (
    <A4Page>
      <div
        style={{
          width: "100%",
          height: "100%",
          padding: "14mm",
          boxSizing: "border-box",
          background: BG,
          fontFamily: "'Jost', sans-serif",
          color: INK,
          display: "flex",
          gap: "10mm",
        }}
      >
        <div style={{ flex: "none", width: "35%", display: "flex", flexDirection: "column", gap: "6mm" }}>
          {view.photo && (
            <div style={{ width: "100%", aspectRatio: "3/4" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={view.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
          )}
          <div>
            <div style={{ fontSize: "9pt", letterSpacing: "0.16em", textTransform: "uppercase", color: TEAL, marginBottom: "1.5mm" }}>
              Marriage Biodata
            </div>
            <div style={{ fontSize: "23pt", fontWeight: 600, lineHeight: 1.18 }}>{view.name}</div>
          </div>
          {!!view.invocation && (
            <div style={{ fontSize: "9.5pt", fontStyle: "italic", color: TEAL }}>{view.invocation}</div>
          )}
          {view.quickFacts.length > 0 && (
            <div style={{ borderTop: `0.75pt solid ${RULE}`, paddingTop: "4mm", display: "flex", flexDirection: "column", gap: "3mm" }}>
              {view.quickFacts.map((q) => (
                <div key={q.label}>
                  <div style={{ fontSize: "8.5pt", letterSpacing: "0.08em", textTransform: "uppercase", color: TEAL }}>{q.label}</div>
                  <div style={{ fontSize: "10.5pt", marginTop: "0.8mm" }}>{q.value}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "3.5mm", overflow: "hidden" }}>
          {view.sections.map((section) => (
            <PreviewFieldSection
              key={section.title}
              section={section}
              columns={2}
              titleStyle={{
                fontSize: "10.5pt",
                fontWeight: 600,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: TEAL,
                paddingBottom: "1.2mm",
                borderBottom: `0.75pt solid ${RULE}`,
              }}
              labelStyle={{ fontSize: "10pt", color: "#6B6B68" }}
              valueStyle={{ fontSize: "10pt", color: INK }}
            />
          ))}
          <div style={{ marginTop: "auto", textAlign: "right", fontSize: "8.5pt", color: "#9B9994" }}>
            Prepared with care, on the occasion of a new beginning
          </div>
        </div>
      </div>
    </A4Page>
  );
}
