import React, { useEffect, useRef, useState } from "react";

/**
 * Renders children inside a fixed 210mm x 297mm box, then scales the whole
 * box down with a CSS transform to fit the available container width. mm
 * units inside children translate 1:1 to the print layout used for the PDF.
 */
const PAGE_WIDTH_MM = 210;
const PAGE_HEIGHT_MM = 297;
// A CSS `mm` is defined as 96px/25.4 — the same conversion the browser uses
// internally for the `mm`-unit child below. The reserved container size
// must be computed in this same pixel space, not in raw mm, or the scaled
// child (post-`transform`) ends up taller/wider than its container and,
// because `transform` creates a stacking context, paints over whatever
// comes after it in the DOM instead of being clipped.
const PAGE_WIDTH_PX = (PAGE_WIDTH_MM / 25.4) * 96;
const PAGE_HEIGHT_PX = (PAGE_HEIGHT_MM / 25.4) * 96;

export function A4Page({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const update = () => {
      const width = el.clientWidth;
      setScale(width > 0 ? width / PAGE_WIDTH_PX : 1);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        position: "relative",
        height: `${PAGE_HEIGHT_PX * scale}px`,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: `${PAGE_WIDTH_MM}mm`,
          height: `${PAGE_HEIGHT_MM}mm`,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
        }}
      >
        {children}
      </div>
    </div>
  );
}
