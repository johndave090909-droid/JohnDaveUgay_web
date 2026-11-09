import React, { useEffect, useState } from 'react';
import { PAGES, hrefFor, type PageId } from '../lib/hashRoute';
import { Brand } from './Brand';

/**
 * Sticky bar on every page except the landing page: the brand (links home) and all pages.
 * Below 1100px the pages fold into a Menu button that opens a full-screen list.
 */
export const SiteHeader: React.FC<{ current: PageId }> = ({ current }) => {
  const [open, setOpen] = useState(false);

  // Any navigation closes the menu
  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener('hashchange', close);
    return () => window.removeEventListener('hashchange', close);
  }, []);

  // While open: Escape closes it, and the page behind does not scroll
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-30 bg-black/85 backdrop-blur-md border-b border-[var(--line)]">
        <div className="mx-auto max-w-[1200px] h-[68px] px-5 sm:px-8 flex items-center justify-between gap-[24px]">
          <Brand />
  
          <nav aria-label="Pages" className="hidden min-[1100px]:block">
            <ul className="m-0 p-0 list-none flex items-center gap-[4px]">
              {PAGES.map((p) => {
                const active = p.id === current;
                return (
                  <li key={p.id}>
                    <a
                      href={hrefFor(p.id)}
                      aria-current={active ? 'page' : undefined}
                      className={`block px-[11px] py-[8px] rounded-full font-mono text-[12.5px] uppercase tracking-[0.06em] no-underline whitespace-nowrap transition-colors ${
                        active ? 'bg-white text-black' : 'text-[#cfcfcf] hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {p.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
  
          <button
            type="button"
            className="min-[1100px]:hidden inline-flex items-center gap-[10px] min-h-[44px] px-[16px] rounded-full border border-[#4a4a4a] font-mono text-[13px] uppercase tracking-[0.08em] text-white bg-transparent cursor-pointer"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((o) => !o)}
          >
            <span aria-hidden="true" className="relative w-[16px] h-[10px]">
              <span className={`absolute left-0 right-0 h-[1.5px] bg-white transition-transform ${open ? 'top-[4px] rotate-45' : 'top-0'}`} />
              <span className={`absolute left-0 right-0 h-[1.5px] bg-white transition-transform ${open ? 'top-[4px] -rotate-45' : 'top-[8px]'}`} />
            </span>
            {open ? 'Close' : 'Menu'}
          </button>
        </div>
      </header>

      {/* Outside the header: its backdrop blur would otherwise trap this fixed panel inside the bar */}
      {open && (
        <nav
          id="site-menu"
          aria-label="Pages"
          className="min-[1100px]:hidden fixed inset-x-0 top-[68px] bottom-0 z-30 bg-black overflow-y-auto"
        >
          <ul className="m-0 p-0 list-none mx-auto max-w-[760px] px-5 sm:px-8 pt-[12px] pb-[48px]">
            {[{ id: 'home' as const, label: 'Home', num: '00', blurb: 'The portrait and the start' }, ...PAGES].map((p) => {
              const active = p.id === current;
              return (
                <li key={p.id} className="border-b border-[var(--line)]">
                  <a
                    href={hrefFor(p.id)}
                    onClick={() => setOpen(false)}
                    aria-current={active ? 'page' : undefined}
                    className="group flex items-center gap-[16px] py-[16px] no-underline"
                  >
                    <span className="font-mono text-[12px] text-[var(--muted)] w-[22px] shrink-0">{p.num}</span>
                    <span className="flex-1 min-w-0">
                      <span className={`block text-[21px] font-medium leading-[1.25] ${active ? 'text-[var(--accent)]' : 'text-white'}`}>
                        {p.label}
                      </span>
                      <span className="block mt-[2px] text-[15px] text-[var(--muted)]">{p.blurb}</span>
                    </span>
                    <span aria-hidden="true" className="text-[20px] text-[var(--accent)]">
                      →
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </>
  );
};
