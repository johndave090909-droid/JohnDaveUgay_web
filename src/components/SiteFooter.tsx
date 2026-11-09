import React from 'react';
import { profile } from '../data/profile';
import { PAGES, hrefFor, scrollToTop, type PageId } from '../lib/hashRoute';

/**
 * Bottom of every page: where to go next, then contact and a way back up.
 * Single project and case-study pages have their own previous/next, so they pass `pageNav={false}`.
 */
export const SiteFooter: React.FC<{ current: PageId; pageNav?: boolean }> = ({ current, pageNav = true }) => {
  const i = PAGES.findIndex((p) => p.id === current);
  const prev = i > 0 ? { href: hrefFor(PAGES[i - 1].id), label: PAGES[i - 1].label } : { href: hrefFor('home'), label: 'Home' };
  const next = i >= 0 && i < PAGES.length - 1 ? PAGES[i + 1] : undefined;

  const card =
    'group block rounded-[14px] border border-[var(--line)] bg-[var(--card)] px-[20px] py-[18px] no-underline hover:border-[#4a4a4a] transition-colors';

  return (
    <footer className="mt-[96px] border-t border-[var(--line)]">
      <div className="mx-auto max-w-[1120px] px-5 sm:px-8 pt-[40px] pb-[calc(40px+env(safe-area-inset-bottom))]">
        {pageNav && (
          <nav aria-label="Previous and next page" className="grid gap-[12px] sm:grid-cols-2 mb-[36px]">
            <a href={prev.href} className={card}>
              <span className="block text-[14px] text-[var(--muted)]">← Previous page</span>
              <span className="block mt-[4px] text-[19px] font-medium text-white">{prev.label}</span>
            </a>
            {next ? (
              <a href={hrefFor(next.id)} className={`${card} sm:text-right`}>
                <span className="block text-[14px] text-[var(--muted)]">Next page →</span>
                <span className="block mt-[4px] text-[19px] font-medium text-white">{next.label}</span>
              </a>
            ) : (
              <a href={hrefFor('home')} className={`${card} sm:text-right`}>
                <span className="block text-[14px] text-[var(--muted)]">Back to the start →</span>
                <span className="block mt-[4px] text-[19px] font-medium text-white">Home</span>
              </a>
            )}
          </nav>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[16px] text-[15px] text-[var(--muted)]">
          <p className="m-0">
            {profile.name} · {profile.location} ·{' '}
            <a href={`mailto:${profile.email}`} className="text-white underline decoration-[#555] underline-offset-[4px] hover:decoration-white">
              {profile.email}
            </a>
          </p>
          <button
            type="button"
            onClick={() => scrollToTop()}
            className="self-start sm:self-auto bg-transparent border-0 p-0 text-[15px] text-[var(--muted)] cursor-pointer hover:text-white"
          >
            Back to top ↑
          </button>
        </div>
      </div>
    </footer>
  );
};
