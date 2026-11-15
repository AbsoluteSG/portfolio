"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Placeholder hero: a pixel-art stage that runs Vrox's actual projectile model.
 * Every shot is a row written once at spawn — origin, direction, speed, timestamp,
 * wave parameters — and its position is a pure function of elapsed time. Nothing
 * here updates a bullet after it's fired; the loop only inserts and deletes.
 */

export type Pattern = "single" | "spread" | "ring" | "parallel" | "helix";
export const PATTERNS: { id: Pattern; label: string; blurb: string }[] = [
  { id: "single", label: "Single", blurb: "One projectile." },
  { id: "spread", label: "Spread", blurb: "Fanned across an arc, centred on the aim." },
  { id: "ring", label: "Ring", blurb: "Evenly around a circle." },
  { id: "parallel", label: "Parallel", blurb: "Side by side, same direction, offset perpendicular to travel." },
  { id: "helix", label: "Helix", blurb: "Same direction, wave phases spread evenly so the strands braid." },
];

type Shot = { ox: number; oy: number; ang: number; speed: number; t0: number; life: number; amp: number; freq: number; phase: number; color: string };
type Enemy = { x: number; y: number; a: number; r: number; hp: number; flash: number };
type Bag = { x: number; y: number; t0: number; tier: number };

const W = 320, H = 180, TILE = 16;
const COLORS: Record<Pattern, string> = { single: "#f8d84a", spread: "#4f8cff", ring: "#e34234", parallel: "#35d461", helix: "#b06cff" };

// 8x8 sprites. '.' transparent.
const PLAYER = ["..3333..", ".333333.", "3.3333.3", "33111133", ".311113.", "..3223..", ".33..33.", ".4....4."];
const PLAYER_PAL: Record<string, string> = { "1": "#f2d3b0", "2": "#c9a06a", "3": "#4f8cff", "4": "#2b2b33" };
const ENEMY = ["..1111..", ".111111.", "11211211", "11111111", "1.1111.1", "1..11..1", ".1....1.", "........"];
const ENEMY_PAL: Record<string, string> = { "1": "#e34234", "2": "#ffd1cc" };

function sprite(ctx: CanvasRenderingContext2D, map: string[], pal: Record<string, string>, x: number, y: number, flipX = false) {
  for (let r = 0; r < map.length; r++) for (let c = 0; c < map[r].length; c++) {
    const k = map[r][c]; if (k === ".") continue;
    ctx.fillStyle = pal[k]; ctx.fillRect(Math.round(x + (flipX ? 7 - c : c)), Math.round(y + r), 1, 1);
  }
}

export function Playground({ pattern, spin, wave }: { pattern: Pattern; spin: boolean; wave: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const state = useRef({ pattern, spin, wave });
  const [stats, setStats] = useState({ alive: 0, inserts: 0, deletes: 0 });
  useEffect(() => { state.current = { pattern, spin, wave }; }, [pattern, spin, wave]);

  useEffect(() => {
    const cv = ref.current; if (!cv) return;
    const ctx = cv.getContext("2d")!; ctx.imageSmoothingEnabled = false;
    const bags: HTMLImageElement[] = ["common", "uncommon", "rare", "epic", "legendary", "boss"].map((n) => { const i = new Image(); i.src = `/projects/vrox/bag-${n}.png`; return i; });

    // floor tiles, seeded once
    const tiles: number[] = []; let seed = 7;
    const rnd = () => (seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff;
    for (let i = 0; i < (W / TILE) * (H / TILE); i++) tiles.push(rnd());

    const cx = W / 2, cy = H / 2;
    let px = cx, py = cy;
    const keys = new Set<string>();
    let aim = { x: W * 0.8, y: H * 0.35 };
    const shots: Shot[] = []; const drops: Bag[] = [];
    const enemies: Enemy[] = [0, 1, 2].map((i) => ({ x: 0, y: 0, a: (i / 3) * Math.PI * 2, r: 60 + i * 8, hp: 6, flash: 0 }));
    let inserts = 0, deletes = 0, lastShot = 0, running = true, raf = 0;
    const t0 = performance.now();

    const onMove = (e: PointerEvent) => { const r = cv.getBoundingClientRect(); aim = { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H }; };
    cv.addEventListener("pointermove", onMove);
    const onKey = (down: boolean) => (e: KeyboardEvent) => { const k = e.key.toLowerCase(); if ("wasd".includes(k) || k.startsWith("arrow")) { if (down) keys.add(k); else keys.delete(k); if (running) e.preventDefault(); } };
    const kd = onKey(true), ku = onKey(false);
    window.addEventListener("keydown", kd); window.addEventListener("keyup", ku);
    const io = new IntersectionObserver(([en]) => { running = en.isIntersecting; if (running && !raf) raf = requestAnimationFrame(frame); });
    io.observe(cv);

    const fire = (now: number) => {
      const { pattern, spin, wave } = state.current;
      const base = Math.atan2(aim.y - py, aim.x - px) + (spin ? (now / 1000) * 1.2 : 0); // spin: derived from the spawn timestamp, no per-player state
      const amp = wave ? 6 : 0, freq = 2.2, speed = 70, life = 1600, color = COLORS[pattern];
      const push = (ang: number, phase = 0, ox = px, oy = py) => { shots.push({ ox, oy, ang, speed, t0: now, life, amp, freq, phase, color }); inserts++; };
      if (pattern === "single") push(base);
      if (pattern === "spread") for (let i = 0; i < 5; i++) push(base - Math.PI / 6 + (i / 4) * (Math.PI / 3));
      if (pattern === "ring") for (let i = 0; i < 12; i++) push(base + (i / 12) * Math.PI * 2);
      if (pattern === "parallel") for (let i = -1; i <= 1; i++) push(base, 0, px + Math.cos(base + Math.PI / 2) * i * 6, py + Math.sin(base + Math.PI / 2) * i * 6);
      if (pattern === "helix") for (let i = 0; i < 3; i++) { shots.push({ ox: px, oy: py, ang: base, speed, t0: now, life, amp: wave ? 8 : 0, freq, phase: (i / 3) * Math.PI * 2, color }); inserts++; }
    };

    const frame = (now: number) => {
      raf = 0; if (!running) return;
      const t = (now - t0) / 1000;
      // movement: a fixed step per input, direction normalised — the same two rules the server applies
      let mx = (keys.has("d") || keys.has("arrowright") ? 1 : 0) - (keys.has("a") || keys.has("arrowleft") ? 1 : 0);
      let my = (keys.has("s") || keys.has("arrowdown") ? 1 : 0) - (keys.has("w") || keys.has("arrowup") ? 1 : 0);
      if (mx || my) { const len = Math.hypot(mx, my); mx /= len; my /= len; px = Math.min(W - TILE - 4, Math.max(TILE + 4, px + mx * 1.4)); py = Math.min(H - TILE - 4, Math.max(TILE + 4, py + my * 1.4)); }
      // enemies orbit; hit test against analytic shot positions
      for (const e of enemies) { e.a += 0.004; e.x = cx + Math.cos(e.a) * e.r; e.y = cy + Math.sin(e.a) * (e.r * 0.55); e.flash = Math.max(0, e.flash - 1); }

      if (now - lastShot > 280) { fire(now); lastShot = now; }

      // draw floor
      for (let ty = 0; ty < H / TILE; ty++) for (let tx = 0; tx < W / TILE; tx++) {
        const v = tiles[ty * (W / TILE) + tx]; const edge = tx === 0 || ty === 0 || tx === W / TILE - 1 || ty === H / TILE - 1;
        ctx.fillStyle = edge ? "#2a2330" : v > 0.92 ? "#1b1b21" : v > 0.5 ? "#141418" : "#121216";
        ctx.fillRect(tx * TILE, ty * TILE, TILE, TILE);
        if (!edge && v > 0.96) { ctx.fillStyle = "#0c0c0f"; ctx.fillRect(tx * TILE + 5, ty * TILE + 9, 6, 1); ctx.fillRect(tx * TILE + 8, ty * TILE + 6, 1, 4); }
        if (edge) { ctx.fillStyle = "#3a3042"; ctx.fillRect(tx * TILE, ty * TILE, TILE, 2); }
      }

      // bags (expire like the server's BagLifetimeSeconds, but faster here)
      for (let i = drops.length - 1; i >= 0; i--) { const b = drops[i]; if (now - b.t0 > 6000) { drops.splice(i, 1); continue; } const img = bags[b.tier]; if (img.complete) ctx.drawImage(img, b.x - 6, b.y - 6, 12, 12); }

      // shots: position is a function of elapsed time — origin + dir·speed·t, plus a perpendicular wave
      for (let i = shots.length - 1; i >= 0; i--) {
        const s = shots[i]; const age = (now - s.t0) / 1000;
        if (age * 1000 > s.life) { shots.splice(i, 1); deletes++; continue; } // the cleanup timer
        const d = s.speed * age, wv = s.amp * Math.sin(age * s.freq * Math.PI * 2 + s.phase);
        const x = s.ox + Math.cos(s.ang) * d + Math.cos(s.ang + Math.PI / 2) * wv;
        const y = s.oy + Math.sin(s.ang) * d + Math.sin(s.ang + Math.PI / 2) * wv;
        if (x < 0 || y < 0 || x > W || y > H) { shots.splice(i, 1); deletes++; continue; }
        ctx.fillStyle = s.color; ctx.fillRect(Math.round(x) - 1, Math.round(y), 3, 1); ctx.fillRect(Math.round(x), Math.round(y) - 1, 1, 3);
        for (const e of enemies) if (Math.abs(e.x + 4 - x) < 5 && Math.abs(e.y + 4 - y) < 5 && e.hp > 0) {
          e.hp--; e.flash = 4; shots.splice(i, 1); deletes++;
          if (e.hp <= 0) { drops.push({ x: e.x + 4, y: e.y + 4, t0: now, tier: Math.min(5, Math.floor(Math.random() * 7)) }); e.hp = 6; e.r = 50 + Math.random() * 30; e.a += Math.PI; }
          break;
        }
      }

      for (const e of enemies) sprite(ctx, ENEMY, e.flash ? { "1": "#ffffff", "2": "#ffffff" } : ENEMY_PAL, e.x, e.y);
      // aim line + player
      ctx.strokeStyle = "rgba(248,216,74,0.25)"; ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(aim.x, aim.y); ctx.stroke();
      sprite(ctx, PLAYER, PLAYER_PAL, px - 4, py - 4, aim.x < px);
      ctx.fillStyle = "#f8d84a"; ctx.fillRect(Math.round(aim.x) - 2, Math.round(aim.y), 5, 1); ctx.fillRect(Math.round(aim.x), Math.round(aim.y) - 2, 1, 5);

      // HUD
      ctx.fillStyle = "rgba(0,0,0,0.55)"; ctx.fillRect(4, 4, 118, 12);
      ctx.fillStyle = "#e8e6df"; ctx.font = "7px monospace"; ctx.fillText(`SHOTS ${String(shots.length).padStart(3, " ")}  INS ${inserts}  DEL ${deletes}`, 7, 13);
      if (Math.floor(t * 4) % 4 === 0) setStats({ alive: shots.length, inserts, deletes });
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => { running = false; if (raf) cancelAnimationFrame(raf); cv.removeEventListener("pointermove", onMove); window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); io.disconnect(); };
  }, []);

  return (
    <div className="vx-stage">
      <canvas ref={ref} width={W} height={H} aria-label="Pixel-art demo of Vrox's projectile patterns. WASD to move, pointer to aim." />
      <div className="vx-pixel pointer-events-none absolute right-2 bottom-2 text-[0.45rem] text-[var(--vx-dim)]">
        {stats.alive} live · {stats.inserts} inserts · {stats.deletes} deletes
      </div>
    </div>
  );
}
