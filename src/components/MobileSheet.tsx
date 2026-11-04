import React from 'react';
import { isHome, scrollContentTo, type Route } from '../lib/hashRoute';
import type { Filter } from '../lib/lists';
import type { ListItem } from './IndexList';
import { Detail } from './Detail';
import { chipClass } from './ui';

interface MobileSheetProps {
  route: Route;
  items: ListItem[];
  activeId?: string;
  filter: Filter;
  setFilter: (f: Filter) => void;
}

/**
 * Phone layout. One scroll container fills the screen under the header. A transparent spacer at the top lets the
 * portrait show first; the panel then slides up over it and takes the whole screen for reading, so there is no
 * nested scrolling and no half-height sheet.
 */
export const MobileSheet: React.FC<MobileSheetProps> = ({ route, items, activeId, filter, setFilter }) => {
  // The home page carries its own filter and headings, so it needs no chip index on top
  const chips = isHome(route.section) ? [] : items.filter((i) => i.kind !== 'static');
  const firstLine = (s: string) => s.split('\n')[0];

  return (
    <div
      id="content"
      className="content-fade fixed inset-x-0 top-[128px] bottom-0 z-20 pointer-events-auto overflow-y-auto no-scrollbar overscroll-y-contain"
    >
      {/* The portrait shows through here until the panel is pulled up */}
      <div data-hero className="h-[40vh] min-h-[180px]" aria-hidden="true" />

      <div className="min-h-full bg-[var(--panel)] backdrop-blur-[6px] border-t border-[var(--line)] rounded-t-[14px]">
        <div className="pt-[10px] pb-[4px]">
          <div className="mx-auto w-[36px] h-[3px] rounded-full bg-[#3a3a3a]" aria-hidden="true" />
        </div>

        {chips.length > 0 && (
          <div
            data-sticky
            className="sticky top-0 z-10 flex gap-[6px] overflow-x-auto no-scrollbar px-[20px] py-[10px] bg-[var(--panel)] backdrop-blur-[6px]"
          >
            {chips.map((item) => {
              const active = item.id === activeId;
              const cls = `${chipClass(active)} shrink-0 no-underline hover:opacity-100 py-[8px]`;
              if (item.kind === 'route') {
                return (
                  <a key={item.id} href={item.href} className={cls}>
                    {firstLine(item.left)}
                  </a>
                );
              }
              if (item.kind === 'link') {
                return (
                  <a key={item.id} href={item.href} target="_blank" rel="noreferrer" className={cls}>
                    {firstLine(item.left)}
                  </a>
                );
              }
              return (
                <button key={item.id} type="button" className={cls} onClick={() => scrollContentTo(item.id)}>
                  {firstLine(item.left)}
                </button>
              );
            })}
          </div>
        )}

        <div className="px-[20px] pt-[8px] pb-[calc(56px+env(safe-area-inset-bottom))]">
          <Detail route={route} activeId={activeId} filter={filter} setFilter={setFilter} mobile />
        </div>
      </div>
    </div>
  );
};
