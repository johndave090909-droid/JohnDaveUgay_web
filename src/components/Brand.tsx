import React from 'react';
import { profile } from '../data/profile';
import { hrefFor } from '../lib/hashRoute';

/** The JD mark and name. Always links home, to the portrait. `compact` shows the mark alone. */
export const Brand: React.FC<{ compact?: boolean }> = ({ compact }) => (
  <a
    href={hrefFor('home')}
    className="flex items-center gap-[12px] no-underline shrink-0"
    aria-label={`${profile.name}, home`}
  >
    <svg width="38" height="38" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0" aria-hidden="true">
      <circle cx="20" cy="20" r="18.5" stroke="white" strokeWidth="1.6" />
      <text
        x="20"
        y="24.6"
        textAnchor="middle"
        fontSize="13"
        fontWeight="600"
        fill="white"
        letterSpacing="0.06em"
        fontFamily="ui-monospace, Menlo, Consolas, monospace"
      >
        {profile.short}
      </text>
    </svg>
    {!compact && (
      <span className="flex flex-col">
        <span className="text-[17px] font-semibold text-white leading-[1.1]">{profile.name}</span>
        <span className="hidden sm:block mt-[3px] font-mono text-[11px] uppercase tracking-[0.08em] text-[var(--muted)] leading-none">
          {profile.roleLine}
        </span>
      </span>
    )}
  </a>
);
