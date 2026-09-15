"use client";

import { useEffect, useRef } from "react";

type Props = {
  src: string;
  poster?: string;
  className?: string;
  /** Show the native controls (for the cutscene). Loops are chrome-free. */
  controls?: boolean;
  label: string;
};

/** Muted video that plays while it's on screen and pauses when it isn't — no autoplay cost off-screen. */
export function AutoVideo({ src, poster, className, controls = false, label }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.4 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      className={className}
      muted
      loop
      playsInline
      preload="metadata"
      controls={controls}
      aria-label={label}
    />
  );
}
