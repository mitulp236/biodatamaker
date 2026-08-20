import React from "react";
import { Page, View, Text, Image } from "@react-pdf/renderer";
import { BiodataView } from "@/lib/biodataView";
import { PdfFieldGrid } from "./PdfFieldGrid";

const TEAL = "#1F4E4A";
const INK = "#1B1B1A";
const BG = "#FBFAF8";
const RULE = "#D8D4CC";
const MUTED = "#6B6B68";

export function ModernPdf({ view }: { view: BiodataView }) {
  const hasPhoto = !!view.photo;

  return (
    <>
      <Page
        size="A4"
        style={{
          padding: "14mm",
          backgroundColor: BG,
          fontFamily: "Jost",
          color: INK,
          display: "flex",
          flexDirection: "row",
          gap: 28,
        }}
      >
        <View style={{ width: "35%", display: "flex", flexDirection: "column", gap: 17 }}>
          {hasPhoto && (
            <View style={{ width: "100%", aspectRatio: 3 / 4 }}>
              <Image src={view.photo as string} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </View>
          )}
          <View>
            <Text style={{ fontSize: 9, letterSpacing: 1.4, textTransform: "uppercase", color: TEAL, marginBottom: 4 }}>
              Marriage Biodata
            </Text>
            <Text style={{ fontSize: 23, fontWeight: 600, lineHeight: 1.18 }}>{view.name}</Text>
          </View>
          {!!view.invocation && (
            <Text style={{ fontSize: 9.5, fontStyle: "italic", color: TEAL }}>{view.invocation}</Text>
          )}
          {view.quickFacts.length > 0 && (
            <View style={{ borderTop: `0.75pt solid ${RULE}`, paddingTop: 11, display: "flex", flexDirection: "column", gap: 8 }}>
              {view.quickFacts.map((q) => (
                <View key={q.label}>
                  <Text style={{ fontSize: 8.5, letterSpacing: 0.6, textTransform: "uppercase", color: TEAL }}>
                    {q.label}
                  </Text>
                  <Text style={{ fontSize: 10.5, marginTop: 2 }}>{q.value}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10 }}>
          {view.sections.map((section) => (
            <View key={section.title} style={{ marginBottom: -3 }}>
              <Text
                style={{
                  fontSize: 10.5,
                  fontWeight: 600,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  color: TEAL,
                  paddingBottom: 3,
                  borderBottom: `0.75pt solid ${RULE}`,
                }}
              >
                {section.title}
              </Text>
              <View style={{ paddingTop: 5 }}>
                <PdfFieldGrid
                  fields={section.fields}
                  columns={1}
                  labelStyle={{ fontSize: 10, color: MUTED, width: "35%" }}
                  valueStyle={{ fontSize: 10, color: INK }}
                  rowGap={4}
                />
              </View>
            </View>
          ))}

          <Text style={{ marginTop: "auto", textAlign: "right", fontSize: 8.5, color: "#9B9994" }}>
            Prepared with care, on the occasion of a new beginning
          </Text>
        </View>
      </Page>

      {view.secondaryPhotos.length > 0 && (
        <Page size="A4" style={{ padding: "14mm", backgroundColor: BG, fontFamily: "Jost", display: "flex", flexDirection: "column", alignItems: "center", gap: 16 }}>
          <Text
            style={{
              fontSize: 11,
              letterSpacing: 1.4,
              textTransform: "uppercase",
              color: TEAL,
              borderBottom: `0.75pt solid ${RULE}`,
              paddingBottom: 7,
            }}
          >
            Photographs
          </Text>
          <View style={{ display: "flex", flexDirection: "row", flexWrap: "wrap", justifyContent: "center", gap: 16 }}>
            {view.secondaryPhotos.map((src, i) => (
              <View key={i} style={{ width: "80mm", aspectRatio: 3 / 4 }}>
                <Image src={src} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </View>
            ))}
          </View>
        </Page>
      )}
    </>
  );
}
