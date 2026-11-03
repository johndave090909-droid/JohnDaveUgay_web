import React from 'react';
import { profile } from '../data/profile';
import { hrefFor } from '../lib/hashRoute';

export const Brand: React.FC = () => {
  return (
    <a
      href={hrefFor('about')}
      className="brand absolute top-[24px] left-[24px] flex flex-row items-center gap-[14px] pointer-events-auto select-none z-10 no-underline hover:opacity-100"
      aria-label={`${profile.name}, home`}
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
        aria-hidden="true"
      >
        <circle cx="20" cy="20" r="18.5" stroke="white" strokeWidth="1.6" />
        <text
          x="20"
          y="24.6"
          textAnchor="middle"
          fontSize="13"
          fontWeight="600"
          fill="white"
          letterSpacing="0.06em"
        >
          {profile.short}
        </text>
      </svg>
      <div className="flex flex-col">
        <span className="text-[20px] font-medium text-white leading-none tracking-normal">
          {profile.name}
        </span>
        <span className="text-[11px] text-[var(--muted)] mt-[2px] tracking-[0.02em]">
          {profile.roleLine}
        </span>
      </div>
    </a>
  );
};
