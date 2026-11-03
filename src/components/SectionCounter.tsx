import React from 'react';
import { SECTIONS, type Section } from '../lib/hashRoute';

/** The round counter top-right: which section of seven is open. */
export const SectionCounter: React.FC<{ section: Section }> = ({ section }) => {
  return (
    <div
      className="counter absolute top-[24px] right-[24px] w-[44px] h-[44px] rounded-full border border-[var(--line)] bg-[#0a0a0a] flex items-center justify-center text-[14px] text-white select-none pointer-events-auto z-10"
      aria-label={`Section ${section.num} of ${String(SECTIONS.length).padStart(2, '0')}: ${section.label}`}
      title={`${section.num} / ${String(SECTIONS.length).padStart(2, '0')} · ${section.label}`}
    >
      {section.num}
    </div>
  );
};
