import React from "react";
import { BiodataView } from "@/lib/biodataView";
import { A4Page } from "./A4Page";
import { PreviewFieldSection } from "./PreviewFieldSection";

const ROSE = "#B5697A";
const ROSE_DEEP = "#8C4A5B";
const INK = "#332A2C";
const IVORY = "#FDFBF7";
const RULE = "#E4D6D9";

function Sprig({ corner }: { corner: "tl" | "br" }) {
  const style: React.CSSProperties =
    corner === "tl"
      ? { top: "14mm", left: "14mm" }
      : { bottom: "14mm", right: "14mm", transform: "scale(-1,-1)" };
  return (
    <svg viewBox="0 0 120 120" style={{ position: "absolute", width: "34mm", height: "34mm", opacity: 0.9, ...style }}>
      <path d="M4 4 C 30 6, 40 20, 38 40 C 50 30, 66 34, 70 50" fill="none" stroke={ROSE} strokeWidth={1.4} strokeLinecap="round" />
      <ellipse cx={40} cy={20} rx={7} ry={3.4} transform="rotate(35 40 20)" fill={ROSE} opacity={0.75} />
      <ellipse cx={52} cy={34} rx={6} ry={3} transform="rotate(-15 52 34)" fill={ROSE} opacity={0.6} />
      <ellipse cx={62} cy={46} rx={5.5} ry={2.8} transform="rotate(30 62 46)" fill={ROSE_DEEP} opacity={0.65} />
      <circle cx={16} cy={10} r={2} fill={ROSE_DEEP} />
      <circle cx={26} cy={6} r={1.4} fill={ROSE} />
    </svg>
  );
}

export function PreviewBotanical({ view }: { view: BiodataView }) {
  return (
    <A4Page>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          padding: "14mm",
          boxSizing: "border-box",
          background: IVORY,
          fontFamily: "'Lora', serif",
          color: INK,
          overflow: "hidden",
        }}
      >
        <Sprig corner="tl" />
        <Sprig corner="br" />

        <div style={{ position: "relative", height: "100%", display: "flex", flexDirection: "column", gap: "4mm" }}>
          {!!view.invocation && (
            <div style={{ textAlign: "center", fontSize: "11.5pt", fontStyle: "italic", color: ROSE_DEEP }}>
              {view.invocation}
            </div>
          )}

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "7mm", paddingBottom: "3.5mm", borderBottom: `1pt solid ${RULE}` }}>
            <div style={{ flex: 1, minWidth: 0, paddingTop: "2mm" }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: "31pt", fontWeight: 700, color: ROSE_DEEP, lineHeight: 1.15 }}>
                {view.name}
              </div>
            </div>
            {view.photo && (
              <div
                style={{
                  flex: "none",
                  width: "32mm",
                  height: "42.6mm",
                  borderRadius: "16mm 16mm 2mm 2mm",
                  overflow: "hidden",
                  border: `1.4pt solid ${ROSE}`,
                  boxSizing: "border-box",
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={view.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
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
                  fontFamily: "'Playfair Display', serif",
                  fontSize: "12pt",
                  fontWeight: 600,
                  letterSpacing: "0.06em",
                  color: ROSE_DEEP,
                  paddingBottom: "1.3mm",
                  borderBottom: `0.75pt solid ${RULE}`,
                }}
                labelStyle={{ fontSize: "10pt", fontWeight: 600, color: ROSE_DEEP }}
                valueStyle={{ fontSize: "10pt", color: INK }}
              />
            ))}
          </div>

          <div style={{ textAlign: "center", fontSize: "8.5pt", fontStyle: "italic", color: ROSE, borderTop: `0.5pt solid ${RULE}`, paddingTop: "2mm" }}>
            Prepared with care, on the occasion of a new beginning
          </div>
        </div>
      </div>
    </A4Page>
  );
}
