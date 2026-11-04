import React, { useEffect, useRef } from 'react';
import { SECTIONS, hrefFor, type Section, type SectionId } from '../lib/hashRoute';

interface NavProps {
  active: SectionId;
  /** On phones the links scroll sideways in one row under the brand. */
  mobile?: boolean;
}

// Two groups: the parts of the scrolling home page, then the pages of their own.
// Wide screens put both in one row beside the brand; narrower desktops stack them in the left column.
export const Nav: React.FC<NavProps> = ({ active, mobile }) => {
  const navRef = useRef<HTMLElement>(null);

  // On phones, keep the active link in the visible part of the row
  useEffect(() => {
    if (!mobile) return;
    const nav = navRef.current;
    const link = nav?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!nav || !link) return;
    const left = link.offsetLeft - 24;
    const right = link.offsetLeft + link.offsetWidth + 48 - nav.clientWidth;
    if (nav.scrollLeft > left) nav.scrollTo({ left, behavior: 'smooth' });
    else if (nav.scrollLeft < right) nav.scrollTo({ left: right, behavior: 'smooth' });
  }, [active, mobile]);

  const layout = mobile
    ? 'top-[80px] left-0 right-0 pl-[24px] pr-[56px] flex items-center gap-[18px] overflow-x-auto no-scrollbar nav-fade'
    : `top-[120px] left-[24px] w-[320px] flex flex-col gap-[10px]
       min-[1280px]:top-[30px] min-[1280px]:left-auto min-[1280px]:right-[90px] min-[1280px]:w-auto
       min-[1280px]:flex-row min-[1280px]:items-center min-[1280px]:gap-[22px]`;
  const group = mobile ? 'flex gap-[18px] shrink-0' : 'flex flex-wrap gap-x-[20px] gap-y-[4px]';
  // Bigger tap targets on phones
  const size = mobile ? 'py-[12px] text-[13px]' : 'py-[6px] text-[12px]';

  const link = (s: Section) => {
    const isActive = s.id === active;
    return (
      <a
        key={s.id}
        href={hrefFor(s.id)}
        aria-current={isActive ? 'page' : undefined}
        className={`relative shrink-0 ${size} leading-none tracking-[0.06em] no-underline whitespace-nowrap transition-colors duration-150 hover:opacity-100
          after:absolute after:left-0 after:right-0 after:bottom-[6px] after:h-[2px] after:transition-colors ${
            isActive ? 'text-white after:bg-[var(--accent)]' : 'text-[#a8a8a8] hover:text-white after:bg-transparent'
          } ${mobile ? '' : 'after:bottom-0'}`}
      >
        {s.label}
      </a>
    );
  };

  return (
    <nav ref={navRef} aria-label="Sections" className={`nav absolute ${layout} pointer-events-auto z-10 select-none`}>
      <div className={group}>{SECTIONS.filter((s) => s.home).map(link)}</div>
      <span
        aria-hidden="true"
        className={`w-px h-[14px] bg-[#3a3a3a] shrink-0 ${mobile ? '' : 'hidden min-[1280px]:block'}`}
      />
      <div
        className={`${group} ${
          mobile ? '' : 'max-[1279px]:border-t max-[1279px]:border-[var(--line)] max-[1279px]:pt-[10px]'
        }`}
      >
        {SECTIONS.filter((s) => !s.home).map(link)}
      </div>
    </nav>
  );
};
