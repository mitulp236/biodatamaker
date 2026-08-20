import React from "react";
import { BiodataView } from "@/lib/biodataView";
import { A4Page } from "./A4Page";
import { PreviewFieldSection } from "./PreviewFieldSection";

const MAROON = "#7B1E28";
const GOLD = "#C8A25A";
const IVORY = "#FBF6EC";
const INK = "#241512";

function Corner({ corner }: { corner: "tl" | "tr" | "bl" | "br" }) {
  const pos: Record<string, React.CSSProperties> = {
    tl: { top: "2mm", left: "2mm" },
    tr: { top: "2mm", right: "2mm", transform: "scaleX(-1)" },
    bl: { bottom: "2mm", left: "2mm", transform: "scaleY(-1)" },
    br: { bottom: "2mm", right: "2mm", transform: "scale(-1,-1)" },
  };
  return (
    <div style={{ position: "absolute", width: "13mm", height: "13mm", ...pos[corner] }}>
      <svg viewBox="0 0 60 60" style={{ width: "100%", height: "100%" }}>
        <path d="M2 40 A38 38 0 0 1 40 2" fill="none" stroke={GOLD} strokeWidth={1.6} />
        <path d="M2 28 A26 26 0 0 1 28 2" fill="none" stroke={MAROON} strokeWidth={1} />
        <rect x={8} y={8} width={6} height={6} transform="rotate(45 11 11)" fill={MAROON} />
        <circle cx={24} cy={6} r={1.8} fill={GOLD} />
        <circle cx={6} cy={24} r={1.8} fill={GOLD} />
      </svg>
    </div>
  );
}

export function PreviewTraditional({ view }: { view: BiodataView }) {
  return (
    <A4Page>
      <div
        style={{
          width: "100%",
          height: "100%",
          padding: "14mm",
          boxSizing: "border-box",
          background: IVORY,
          fontFamily: "'EB Garamond', serif",
          color: INK,
        }}
      >
        <div style={{ position: "relative", width: "100%", height: "100%", border: `2pt solid ${MAROON}`, padding: "3mm", boxSizing: "border-box" }}>
          <div
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              border: `1pt solid ${GOLD}`,
              padding: "6mm 9mm",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              gap: "4mm",
              overflow: "hidden",
            }}
          >
            <Corner corner="tl" />
            <Corner corner="tr" />
            <Corner corner="bl" />
            <Corner corner="br" />

            {!!view.invocation && (
              <div style={{ textAlign: "center", fontFamily: "'Cormorant Garamond', serif", fontSize: "12pt", letterSpacing: "0.08em", color: MAROON, fontStyle: "italic" }}>
                {view.invocation}
              </div>
            )}

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "7mm", paddingBottom: "3mm", borderBottom: `1pt solid ${GOLD}` }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "29pt", fontWeight: 700, color: MAROON, lineHeight: 1.15 }}>
                  {view.name}
                </div>
              </div>
              {view.photo && (
                <div style={{ flex: "none", width: "32mm", height: "42.6mm", padding: "1.3mm", border: `1.4pt solid ${GOLD}`, boxSizing: "border-box" }}>
                  <div style={{ width: "100%", height: "100%", padding: "1mm", border: `0.75pt solid ${MAROON}`, boxSizing: "border-box" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={view.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                </div>
              )}
            </div>

            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "3.5mm", overflow: "hidden" }}>
              {view.sections.map((section) => (
                <PreviewFieldSection
                  key={section.title}
                  section={section}
                  columns={4}
                  titleStyle={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "11.5pt",
                    fontWeight: 600,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: MAROON,
                    paddingBottom: "1.3mm",
                    borderBottom: `0.75pt solid ${GOLD}`,
                  }}
                  labelStyle={{ fontSize: "10pt", fontWeight: 600, color: INK }}
                  valueStyle={{ fontSize: "10pt", color: INK }}
                />
              ))}
            </div>

            <div style={{ textAlign: "center", fontSize: "8.5pt", fontStyle: "italic", color: GOLD, borderTop: `0.5pt solid ${GOLD}`, paddingTop: "2mm" }}>
              Prepared with care, on the occasion of a new beginning
            </div>
          </div>
        </div>
      </div>
    </A4Page>
  );
}
