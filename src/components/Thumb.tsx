import React, { useMemo } from 'react';
import type { ProjectImage } from '../data/projects';

// A generated thumbnail: a stipple of dots in the same spirit as the particle portrait behind the page.
// It is deterministic per seed, so a card always looks the same. Pass `image` to use a real screenshot instead.

function hashStr(s: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h >>> 0;
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

interface Dot {
  x: number;
  y: number;
  r: number;
  o: number;
  c: string;
}

const W = 320;
const H = 160;

function makeDots(seed: string): Dot[] {
  const rnd = mulberry32(hashStr(seed));
  // One soft, tilted blob of density per card
  const cx = 90 + rnd() * 140;
  const cy = 40 + rnd() * 80;
  const sx = 45 + rnd() * 60;
  const sy = 28 + rnd() * 40;
  const angle = rnd() * Math.PI;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const out: Dot[] = [];
  for (let i = 0; i < 900; i++) {
    const x = rnd() * W;
    const y = rnd() * H;
    const dx = x - cx;
    const dy = y - cy;
    const u = (dx * cos + dy * sin) / sx;
    const v = (-dx * sin + dy * cos) / sy;
    const w = Math.exp(-(u * u + v * v) / 2);
    if (rnd() > 0.05 + 0.95 * w) continue;
    const lavender = rnd() < 0.18;
    out.push({
      x,
      y,
      r: 0.7 + rnd() * 1.0 + w * 0.6,
      o: 0.2 + 0.8 * w * (0.55 + 0.45 * rnd()),
      c: lavender ? '#aa88ff' : '#ffffff',
    });
  }
  return out;
}

export interface ThumbProps {
  seed: string;
  code: string;
  stat?: string;
  image?: ProjectImage;
}

export const Thumb: React.FC<ThumbProps> = ({ seed, code, stat, image }) => {
  const dots = useMemo(() => (image ? [] : makeDots(seed)), [seed, image]);

  // A screenshot keeps the same code and figure along the bottom, over a shade so they stay legible.
  // Decorative here: the card's title sits right under it.
  if (image) {
    return (
      <div className="relative w-full h-full">
        <img
          src={image.src}
          alt=""
          loading="lazy"
          className="w-full h-full object-cover block"
          style={{ objectPosition: image.position }}
        />
        <div className="absolute inset-x-0 bottom-0 h-[60px] bg-gradient-to-t from-black/90 to-transparent" />
        <span className="absolute left-[12px] bottom-[9px] text-[12px] leading-none text-white tracking-[0.08em]">
          {code}
        </span>
        {stat && (
          <span className="absolute right-[12px] bottom-[9px] text-[11px] leading-none text-[#bdbdbd] tracking-[0.04em]">
            {stat}
          </span>
        )}
      </div>
    );
  }

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className="w-full h-full block"
      aria-hidden="true"
    >
      <rect width={W} height={H} fill="#0a0a0a" />
      {dots.map((d, i) => (
        <circle
          key={i}
          cx={d.x.toFixed(1)}
          cy={d.y.toFixed(1)}
          r={d.r.toFixed(2)}
          fill={d.c}
          opacity={d.o.toFixed(2)}
        />
      ))}
      <text x="12" y="146" fill="#ffffff" fontSize="12" letterSpacing="0.08em">
        {code}
      </text>
      {stat && (
        <text x={W - 12} y="146" fill="#8a8a8a" fontSize="11" textAnchor="end" letterSpacing="0.04em">
          {stat}
        </text>
      )}
    </svg>
  );
};
