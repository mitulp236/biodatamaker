import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "@/components/providers/SessionProvider";

export const metadata: Metadata = {
  title: "Biodata Maker",
  description: "Create a print-ready Indian marriage biodata in minutes. Nothing is saved to our servers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=EB+Garamond:wght@400;500;600&family=Jost:wght@400;500;600;700&family=Playfair+Display:wght@600;700&family=Lora:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap"
        />
      </head>
      <body className="antialiased bg-stone-50 text-stone-900" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
