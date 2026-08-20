import React from "react";
import { Page, View, Text, Image, Svg, Path, Ellipse, Circle } from "@react-pdf/renderer";
import { BiodataView } from "@/lib/biodataView";
import { PdfFieldGrid } from "./PdfFieldGrid";

const ROSE = "#B5697A";
const ROSE_DEEP = "#8C4A5B";
const INK = "#332A2C";
const IVORY = "#FDFBF7";
const RULE = "#E4D6D9";

function BotanicalSprig({ corner }: { corner: "tl" | "br" }) {
  const style =
    corner === "tl"
      ? { top: "14mm", left: "14mm" }
      : { bottom: "14mm", right: "14mm", transform: "scale(-1, -1)" };
  return (
    <View style={{ position: "absolute", width: "34mm", height: "34mm", opacity: 0.9, ...style }}>
      <Svg viewBox="0 0 120 120" style={{ width: "100%", height: "100%" }}>
        <Path
          d="M4 4 C 30 6, 40 20, 38 40 C 50 30, 66 34, 70 50"
          fill="none"
          stroke={ROSE}
          strokeWidth={1.4}
        />
        <Ellipse cx={40} cy={20} rx={7} ry={3.4} transform="rotate(35 40 20)" fill={ROSE} fillOpacity={0.75} />
        <Ellipse cx={52} cy={34} rx={6} ry={3} transform="rotate(-15 52 34)" fill={ROSE} fillOpacity={0.6} />
        <Ellipse cx={62} cy={46} rx={5.5} ry={2.8} transform="rotate(30 62 46)" fill={ROSE_DEEP} fillOpacity={0.65} />
        <Circle cx={16} cy={10} r={2} fill={ROSE_DEEP} />
        <Circle cx={26} cy={6} r={1.4} fill={ROSE} />
      </Svg>
    </View>
  );
}

export function BotanicalPdf({ view }: { view: BiodataView }) {
  const hasPhoto = !!view.photo;

  return (
    <>
      <Page
        size="A4"
        style={{
          position: "relative",
          padding: "14mm",
          backgroundColor: IVORY,
          fontFamily: "Lora",
          color: INK,
        }}
      >
        <BotanicalSprig corner="tl" />
        <BotanicalSprig corner="br" />

        <View style={{ display: "flex", flexDirection: "column", gap: 11 }}>
          {!!view.invocation && (
            <Text style={{ textAlign: "center", fontSize: 11.5, fontStyle: "italic", color: ROSE_DEEP }}>
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
              paddingBottom: 10,
              borderBottom: `1pt solid ${RULE}`,
            }}
          >
            <View style={{ flex: 1, paddingTop: 6 }}>
              <Text style={{ fontFamily: "Playfair Display", fontSize: 31, fontWeight: 700, color: ROSE_DEEP, lineHeight: 1.15 }}>
                {view.name}
              </Text>
            </View>
            {hasPhoto && (
              <View
                style={{
                  width: "32mm",
                  height: "42.6mm",
                  border: `1.4pt solid ${ROSE}`,
                  borderTopLeftRadius: "16mm",
                  borderTopRightRadius: "16mm",
                  borderBottomLeftRadius: "2mm",
                  borderBottomRightRadius: "2mm",
                  overflow: "hidden",
                }}
              >
                <Image src={view.photo as string} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </View>
            )}
          </View>

          <View style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {view.sections.map((section) => (
              <View key={section.title} style={{ marginBottom: -3 }}>
                <Text
                  style={{
                    fontFamily: "Playfair Display",
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: 0.6,
                    color: ROSE_DEEP,
                    paddingBottom: 4,
                    borderBottom: `0.75pt solid ${RULE}`,
                  }}
                >
                  {section.title}
                </Text>
                <View style={{ paddingTop: 6 }}>
                  <PdfFieldGrid
                    fields={section.fields}
                    columns={2}
                    labelStyle={{ fontSize: 10, fontWeight: 600, color: ROSE_DEEP }}
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
              color: ROSE,
              borderTop: `0.5pt solid ${RULE}`,
              paddingTop: 6,
            }}
          >
            Prepared with care, on the occasion of a new beginning
          </Text>
        </View>
      </Page>

      {view.secondaryPhotos.length > 0 && (
        <Page size="A4" style={{ padding: "14mm", backgroundColor: IVORY, fontFamily: "Lora", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <Text
            style={{
              fontFamily: "Playfair Display",
              fontSize: 16,
              fontWeight: 600,
              color: ROSE_DEEP,
              borderBottom: `0.75pt solid ${RULE}`,
              paddingBottom: 7,
            }}
          >
            Photographs
          </Text>
          <View style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 16 }}>
            {view.secondaryPhotos.map((src, i) => (
              <View
                key={i}
                style={{
                  width: "80mm",
                  aspectRatio: 3 / 4,
                  border: `1.2pt solid ${ROSE}`,
                  borderTopLeftRadius: "6mm",
                  borderTopRightRadius: "6mm",
                  borderBottomLeftRadius: "2mm",
                  borderBottomRightRadius: "2mm",
                  overflow: "hidden",
                }}
              >
                <Image src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </View>
            ))}
          </View>
        </Page>
      )}
    </>
  );
}
