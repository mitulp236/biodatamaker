import React from "react";
import { Page, View, Text, Image, Svg, Path, Rect, Circle } from "@react-pdf/renderer";
import { BiodataView } from "@/lib/biodataView";
import { PdfFieldGrid } from "./PdfFieldGrid";

const MAROON = "#7B1E28";
const GOLD = "#C8A25A";
const IVORY = "#FBF6EC";
const INK = "#241512";

function CornerOrnament({ corner }: { corner: "tl" | "tr" | "bl" | "br" }) {
  const pos: Record<string, object> = {
    tl: { top: "2mm", left: "2mm" },
    tr: { top: "2mm", right: "2mm", transform: "scaleX(-1)" },
    bl: { bottom: "2mm", left: "2mm", transform: "scaleY(-1)" },
    br: { bottom: "2mm", right: "2mm", transform: "scale(-1, -1)" },
  };
  return (
    <View style={{ position: "absolute", width: "13mm", height: "13mm", ...pos[corner] }}>
      <Svg viewBox="0 0 60 60" style={{ width: "100%", height: "100%" }}>
        <Path d="M2 40 A38 38 0 0 1 40 2" fill="none" stroke={GOLD} strokeWidth={1.6} />
        <Path d="M2 28 A26 26 0 0 1 28 2" fill="none" stroke={MAROON} strokeWidth={1} />
        <Rect x={8} y={8} width={6} height={6} transform="rotate(45 11 11)" fill={MAROON} />
        <Circle cx={24} cy={6} r={1.8} fill={GOLD} />
        <Circle cx={6} cy={24} r={1.8} fill={GOLD} />
      </Svg>
    </View>
  );
}

export function TraditionalPdf({ view }: { view: BiodataView }) {
  const hasPhoto = !!view.photo;

  return (
    <>
      <Page
        size="A4"
        style={{
          padding: "14mm",
          backgroundColor: IVORY,
          fontFamily: "EB Garamond",
          color: INK,
        }}
      >
        <View
          style={{
            width: "100%",
            height: "100%",
            border: `2pt solid ${MAROON}`,
            padding: "3mm",
          }}
        >
          <View
            style={{
              position: "relative",
              width: "100%",
              height: "100%",
              border: `1pt solid ${GOLD}`,
              padding: "6mm 9mm",
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <CornerOrnament corner="tl" />
            <CornerOrnament corner="tr" />
            <CornerOrnament corner="bl" />
            <CornerOrnament corner="br" />

            {!!view.invocation && (
              <Text
                style={{
                  textAlign: "center",
                  fontFamily: "Cormorant Garamond",
                  fontWeight: 500,
                  fontSize: 12,
                  color: MAROON,
                  fontStyle: "italic",
                }}
              >
                {view.invocation}
              </Text>
            )}

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 20,
                paddingBottom: 9,
                borderBottom: `1pt solid ${GOLD}`,
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: "Cormorant Garamond",
                    fontSize: 29,
                    fontWeight: 700,
                    color: MAROON,
                    lineHeight: 1.15,
                  }}
                >
                  {view.name}
                </Text>
              </View>
              {hasPhoto && (
                <View
                  style={{
                    width: "32mm",
                    height: "42.6mm",
                    padding: 4,
                    border: `1.4pt solid ${GOLD}`,
                  }}
                >
                  <View style={{ width: "100%", height: "100%", padding: 3, border: `0.75pt solid ${MAROON}` }}>
                    <Image src={view.photo as string} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </View>
                </View>
              )}
            </View>

            <View style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
              {view.sections.map((section) => (
                <View key={section.title} style={{ marginBottom: -3 }}>
                  <Text
                    style={{
                      fontFamily: "Cormorant Garamond",
                      fontSize: 11.5,
                      fontWeight: 600,
                      letterSpacing: 1.2,
                      textTransform: "uppercase",
                      color: MAROON,
                      paddingBottom: 4,
                      borderBottom: `0.75pt solid ${GOLD}`,
                    }}
                  >
                    {section.title}
                  </Text>
                  <View style={{ paddingTop: 6 }}>
                    <PdfFieldGrid
                      fields={section.fields}
                      columns={2}
                      labelStyle={{ fontSize: 10, fontWeight: 600, color: INK }}
                      valueStyle={{ fontSize: 10, color: INK }}
                    />
                  </View>
                </View>
              ))}
            </View>

            <Text
              style={{
                textAlign: "center",
                fontSize: 8.5,
                fontStyle: "italic",
                color: GOLD,
                borderTop: `0.5pt solid ${GOLD}`,
                paddingTop: 6,
              }}
            >
              Prepared with care, on the occasion of a new beginning
            </Text>
          </View>
        </View>
      </Page>

      {view.secondaryPhotos.length > 0 && (
        <Page size="A4" style={{ padding: "14mm", backgroundColor: IVORY, fontFamily: "EB Garamond" }}>
          <View style={{ width: "100%", height: "100%", border: `2pt solid ${MAROON}`, padding: "3mm" }}>
            <View
              style={{
                width: "100%",
                height: "100%",
                border: `1pt solid ${GOLD}`,
                padding: "10mm",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16,
              }}
            >
              <Text
                style={{
                  fontFamily: "Cormorant Garamond",
                  fontSize: 16,
                  fontWeight: 600,
                  letterSpacing: 1.2,
                  textTransform: "uppercase",
                  color: MAROON,
                  borderBottom: `0.75pt solid ${GOLD}`,
                  paddingBottom: 6,
                }}
              >
                Photographs
              </Text>
              <View style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 16 }}>
                {view.secondaryPhotos.map((src, i) => (
                  <View key={i} style={{ width: "80mm", aspectRatio: 3 / 4, padding: 4, border: `1.2pt solid ${GOLD}` }}>
                    <View style={{ width: "100%", height: "100%", padding: 3, border: `0.6pt solid ${MAROON}` }}>
                      <Image src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </Page>
      )}
    </>
  );
}
