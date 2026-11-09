import React from 'react';
import { profile } from '../data/profile';
import { PAGES, hrefFor, useMediaQuery } from '../lib/hashRoute';
import { BackgroundCanvas } from './BackgroundCanvas';
import { Brand } from './Brand';

const mail = `mailto:${profile.email}`;

// Desktop text column: min(620px, 54vw). The portrait centres itself in the space to its right.
const TEXT_MAX_PX = 620;
const TEXT_MAX_VW = 0.54;

/** Name, one sentence and availability. */
const Intro: React.FC = () => (
  <>
    <p className="m-0 font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--accent)]">Portfolio</p>
    <h1 className="mt-[12px] mb-0 text-[40px] min-[761px]:text-[clamp(44px,4.6vw,60px)] leading-[1.04] font-semibold text-white tracking-[-0.015em]">
      {profile.name}
    </h1>
    <p className="mt-[18px] mb-0 text-[18px] min-[761px]:text-[20px] leading-[1.55] text-[#e2e2e2] max-w-[36ch]">
      Supply chain student at BYU–Hawaii. I build the software a 90-person culinary department runs on.
    </p>
    <p className="self-start mt-[18px] mb-0 inline-flex items-center gap-[10px] rounded-full border border-white/15 bg-black/40 px-[14px] py-[8px] text-[14.5px] text-[#e2e2e2]">
      <span aria-hidden="true" className="w-[8px] h-[8px] rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]" />
      {profile.availability}
    </p>
  </>
);

/** Where to go: the three main pages as big rows, the rest as a short list under them. */
const PageMenu: React.FC = () => {
  const primary = PAGES.filter((p) => p.primary);
  const secondary = PAGES.filter((p) => !p.primary);
  return (
    <nav aria-label="Pages" className="mt-[36px]">
      <ul className="m-0 p-0 list-none border-t border-white/15">
        {primary.map((p) => (
          <li key={p.id} className="border-b border-white/15">
            <a href={hrefFor(p.id)} className="group flex items-center gap-[18px] py-[16px] no-underline">
              <span className="font-mono text-[12px] text-[var(--muted)] w-[22px] shrink-0">{p.num}</span>
              <span className="flex-1 min-w-0">
                <span className="block text-[22px] font-medium leading-[1.25] text-white">{p.label}</span>
                <span className="block mt-[2px] text-[15.5px] leading-[1.45] text-[#b5b5b5]">{p.blurb}</span>
              </span>
              <span
                aria-hidden="true"
                className="text-[22px] text-[var(--accent)] transition-transform duration-200 group-hover:translate-x-[4px]"
              >
                →
              </span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-[26px] mb-[6px] font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--muted)]">More</p>
      <ul className="m-0 p-0 list-none grid grid-cols-2 gap-x-[24px]">
        {secondary.map((p) => (
          <li key={p.id}>
            <a
              href={hrefFor(p.id)}
              className="group flex items-center justify-between gap-[10px] py-[11px] border-b border-white/10 text-[16.5px] text-[#dedede] no-underline hover:text-white"
            >
              {p.label}
              <span aria-hidden="true" className="text-[var(--accent)] transition-transform group-hover:translate-x-[3px]">
                →
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

const EmailButton: React.FC = () => (
  <a
    href={mail}
    className="inline-flex items-center justify-center min-h-[44px] px-[18px] rounded-full border border-white/30 bg-black/40 text-[15px] font-medium text-white no-underline hover:border-white transition-colors"
  >
    Email me
  </a>
);

/**
 * The first page: the particle portrait, a short introduction and the way into every page.
 * The portrait appears here and nowhere else.
 */
export const Landing: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 760px)');

  return (
    <main className="fixed inset-0 bg-black overflow-hidden">
      {/* The canvas frames the portrait differently for phones, so it restarts when the layout switches */}
      <BackgroundCanvas
        key={isMobile ? 'phone' : 'desktop'}
        clearLeft={isMobile ? 0 : Math.min(TEXT_MAX_PX, window.innerWidth * TEXT_MAX_VW)}
      />

      {isMobile ? (
        <>
          <div className="fixed inset-x-0 top-0 z-20 h-[96px] bg-gradient-to-b from-black/90 to-transparent pointer-events-none" aria-hidden="true" />
          <header className="fixed inset-x-0 top-0 z-30 h-[72px] px-5 flex items-center justify-between">
            <Brand compact />
            <EmailButton />
          </header>
          <div className="fixed inset-0 z-10 overflow-y-auto overscroll-y-contain no-scrollbar">
            {/* The portrait shows through this gap; the panel scrolls up over it */}
            <div className="h-[52vh] min-h-[260px]" aria-hidden="true" />
            <div className="relative min-h-[60vh] rounded-t-[22px] border-t border-white/15 bg-black/80 backdrop-blur-[8px] px-5 pt-[14px] pb-[calc(48px+env(safe-area-inset-bottom))]">
              <div className="mx-auto mb-[22px] w-[40px] h-[4px] rounded-full bg-white/25" aria-hidden="true" />
              <Intro />
              <PageMenu />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="landing-shade absolute inset-y-0 left-0 z-[1] w-[min(860px,72vw)] pointer-events-none" aria-hidden="true" />
          <header className="absolute inset-x-0 top-0 z-20 h-[88px] px-[clamp(24px,4vw,56px)] flex items-center justify-between">
            <Brand compact />
            <EmailButton />
          </header>
          <div className="absolute inset-y-0 left-0 z-10 w-[min(620px,54vw)] overflow-y-auto no-scrollbar">
            <div className="min-h-full flex flex-col justify-center px-[clamp(24px,4vw,56px)] pt-[104px] pb-[40px]">
              <Intro />
              <PageMenu />
            </div>
          </div>
          <p className="absolute right-[clamp(24px,4vw,56px)] bottom-[24px] z-10 m-0 font-mono text-[11px] uppercase tracking-[0.12em] text-[#7a7a7a] pointer-events-none">
            Move your cursor through the portrait
          </p>
        </>
      )}
    </main>
  );
};
