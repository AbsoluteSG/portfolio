"use client";

import { useEffect, useRef } from "react";

const LAYERS: { src: string; depth: number }[] = [
  { src: "p0-sky.jpg", depth: 0.02 },
  { src: "p1-clouds.webp", depth: 0.06 },
  { src: "p2-mgclouds.webp", depth: 0.1 },
  { src: "p3-mountains.webp", depth: 0.16 },
  { src: "p4-left.webp", depth: 0.3 },
  { src: "p5-right.webp", depth: 0.3 },
  { src: "p6-restaurant.webp", depth: 0.4 },
  { src: "p7-bridge.webp", depth: 0.55 },
  { src: "p8-tents.webp", depth: 0.7 },
  { src: "p9-fg.webp", depth: 0.9 },
];

/** The painted town, layer by layer. Scroll moves layers vertically by depth; the pointer nudges them sideways. */
export function Parallax({ base }: { base: string }) {
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = stage.current;
    if (!el) return;
    const imgs = Array.from(el.querySelectorAll<HTMLImageElement>("img"));
    let mouseX = 0;
    let raf = 0;

    const render = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      // -1 (stage below viewport) → 0 (centered) → 1 (above)
      const progress = Math.max(-1, Math.min(1, (window.innerHeight / 2 - (r.top + r.height / 2)) / window.innerHeight));
      imgs.forEach((img, i) => {
        const d = LAYERS[i].depth;
        const y = progress * d * 90; // px
        const x = mouseX * d * 30;
        img.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      });
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(render);
    };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      mouseX = ((e.clientX - r.left) / r.width - 0.5) * 2;
      schedule();
    };

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    el.addEventListener("pointermove", onMove);
    render();
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      el.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={stage}
      className="nda-stage"
      role="img"
      aria-label="Painted view of the town below the Great Tree, with Whiskers' restaurant"
    >
      {LAYERS.map((l, i) => (
        // Plain <img>: ten stacked layers driven by transforms; next/image's wrapper adds nothing here.
        // eslint-disable-next-line @next/next/no-img-element
        <img key={l.src} src={`${base}/${l.src}`} alt="" draggable={false} loading={i < 4 ? "eager" : "lazy"} />
      ))}
    </div>
  );
}
