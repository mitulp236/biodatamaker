import React, { CSSProperties } from "react";
import { ViewSection } from "@/lib/biodataView";

interface PreviewFieldSectionProps {
  section: ViewSection;
  columns: 2 | 4;
  titleStyle: CSSProperties;
  labelStyle: CSSProperties;
  valueStyle: CSSProperties;
}

export function PreviewFieldSection({
  section,
  columns,
  titleStyle,
  labelStyle,
  valueStyle,
}: PreviewFieldSectionProps) {
  const gridTemplateColumns =
    columns === 4 ? "max-content 1fr max-content 1fr" : "max-content 1fr";

  return (
    <div style={{ breakInside: "avoid" }}>
      <div style={titleStyle}>{section.title}</div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns,
          columnGap: "5mm",
          rowGap: "1.6mm",
          paddingTop: "2mm",
        }}
      >
        {section.fields.map((f) => (
          <React.Fragment key={f.label}>
            <div style={{ ...labelStyle, whiteSpace: "nowrap" }}>{f.label}</div>
            <div style={valueStyle}>{f.value}</div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
