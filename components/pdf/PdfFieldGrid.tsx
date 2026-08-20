import React from "react";
import { View, Text } from "@react-pdf/renderer";
import type { Style } from "@react-pdf/types";
import { ViewField } from "@/lib/biodataView";

interface PdfFieldGridProps {
  fields: ViewField[];
  columns: 1 | 2;
  labelStyle: Style;
  valueStyle: Style;
  rowGap?: number;
}

/**
 * react-pdf has no CSS grid, so label/value pairs are chunked into rows
 * of `columns` pairs and laid out with flexbox.
 */
export function PdfFieldGrid({
  fields,
  columns,
  labelStyle,
  valueStyle,
  rowGap = 5,
}: PdfFieldGridProps) {
  const rows: ViewField[][] = [];
  for (let i = 0; i < fields.length; i += columns) {
    rows.push(fields.slice(i, i + columns));
  }

  return (
    <View style={{ display: "flex", flexDirection: "column", gap: rowGap }}>
      {rows.map((row, i) => (
        <View key={i} style={{ display: "flex", flexDirection: "row", gap: 14 }}>
          {row.map((f, j) => (
            <View
              key={j}
              style={{
                display: "flex",
                flexDirection: "row",
                flex: 1,
                gap: 6,
              }}
            >
              <Text style={labelStyle}>{f.label}</Text>
              <Text style={{ ...valueStyle, flex: 1 }}>{f.value}</Text>
            </View>
          ))}
          {row.length < columns &&
            Array.from({ length: columns - row.length }).map((_, k) => (
              <View key={`spacer-${k}`} style={{ flex: 1 }} />
            ))}
        </View>
      ))}
    </View>
  );
}
