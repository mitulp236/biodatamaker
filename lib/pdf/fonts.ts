import { Font } from "@react-pdf/renderer";

let registered = false;

export function registerPdfFonts() {
  if (registered) return;
  registered = true;

  Font.register({
    family: "Cormorant Garamond",
    fonts: [
      { src: "/fonts/cormorant-500.woff", fontWeight: 500 },
      { src: "/fonts/cormorant-600.woff", fontWeight: 600 },
      { src: "/fonts/cormorant-700.woff", fontWeight: 700 },
      { src: "/fonts/cormorant-500-italic.woff", fontWeight: 500, fontStyle: "italic" },
    ],
  });

  Font.register({
    family: "EB Garamond",
    fonts: [
      { src: "/fonts/ebgaramond-400.woff", fontWeight: 400 },
      { src: "/fonts/ebgaramond-500.woff", fontWeight: 500 },
      { src: "/fonts/ebgaramond-600.woff", fontWeight: 600 },
      { src: "/fonts/ebgaramond-400-italic.woff", fontWeight: 400, fontStyle: "italic" },
    ],
  });

  Font.register({
    family: "Jost",
    fonts: [
      { src: "/fonts/jost-400.woff", fontWeight: 400 },
      { src: "/fonts/jost-500.woff", fontWeight: 500 },
      { src: "/fonts/jost-600.woff", fontWeight: 600 },
      { src: "/fonts/jost-700.woff", fontWeight: 700 },
      { src: "/fonts/jost-400-italic.woff", fontWeight: 400, fontStyle: "italic" },
    ],
  });

  Font.register({
    family: "Playfair Display",
    fonts: [
      { src: "/fonts/playfair-600.woff", fontWeight: 600 },
      { src: "/fonts/playfair-700.woff", fontWeight: 700 },
    ],
  });

  Font.register({
    family: "Lora",
    fonts: [
      { src: "/fonts/lora-400.woff", fontWeight: 400 },
      { src: "/fonts/lora-500.woff", fontWeight: 500 },
      { src: "/fonts/lora-600.woff", fontWeight: 600 },
      { src: "/fonts/lora-400-italic.woff", fontWeight: 400, fontStyle: "italic" },
    ],
  });

  Font.registerHyphenationCallback((word) => [word]);
}
