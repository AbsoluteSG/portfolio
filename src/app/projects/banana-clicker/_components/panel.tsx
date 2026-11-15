/**
 * Chrome shared by every concept panel: the window title bar, the small caps
 * label, and the sprite wrapper. Each panel is a mock of an in-game window, so
 * they should agree on these down to the pixel.
 */

import Image from "next/image";

export function WindowBar({
  title,
  tag,
  tagFill = "var(--bc-yellow)",
  tagInk = "var(--bc-ink)",
}: {
  title: string;
  tag: string;
  tagFill?: string;
  tagInk?: string;
}) {
  return (
    <div className="bc-window-bar">
      <span className="bc-window-title text-lg">{title}</span>
      <span
        className="bc-num shrink-0 rounded-md px-2 py-0.5 text-xs font-extrabold whitespace-nowrap"
        style={{ background: tagFill, color: tagInk }}
      >
        {tag}
      </span>
    </div>
  );
}

export function Label({ children }: { children: React.ReactNode }) {
  return <div className="text-[0.65rem] font-extrabold tracking-[0.16em] text-white/55 uppercase">{children}</div>;
}

/** A real game sprite, sized to whatever slot it sits in. */
export function Sprite({ src, className = "h-[74%] w-[74%]" }: { src: string; className?: string }) {
  return <Image src={src} alt="" width={256} height={256} className={`${className} object-contain`} />;
}
