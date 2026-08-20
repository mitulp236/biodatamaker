import React, { useEffect, useRef, useState } from "react";

/**
 * Renders children inside a fixed 210mm x 297mm box, then scales the whole
 * box down with a CSS transform to fit the available container width. mm
 * units inside children translate 1:1 to the print layout used for the PDF.
 */
export function A4Page({ children }: { children: React.ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const PAGE_WIDTH_PX = (210 / 25.4) * 96;

    const update = () => {
      const width = el.clientWidth;
      setScale(width > 0 ? width / PAGE_WIDTH_PX : 1);
    };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const PAGE_WIDTH_MM = 210;
  const PAGE_HEIGHT_MM = 297;

  return (
    <div ref={containerRef} style={{ width: "100%", position: "relative", height: `${PAGE_HEIGHT_MM * scale}px` }}>
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
