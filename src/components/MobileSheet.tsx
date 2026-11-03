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

/** Phone layout: a bottom sheet over the portrait, holding the index as chips and the content below. */
export const MobileSheet: React.FC<MobileSheetProps> = ({ route, items, activeId, filter, setFilter }) => {
  // The home page carries its own filter and headings, so it needs no chip index on top
  const chips = isHome(route.section) ? [] : items.filter((i) => i.kind !== 'static');
  const firstLine = (s: string) => s.split('\n')[0];

  return (
    <div className="fixed left-0 right-0 bottom-0 h-[58vh] z-20 pointer-events-auto bg-[var(--panel)] backdrop-blur-[6px] border-t border-[var(--line)]">
      <div id="content" className="h-full overflow-y-auto no-scrollbar px-[20px] pt-[12px] pb-[40px]">
        <div className="mx-auto w-[36px] h-[3px] rounded-full bg-[var(--line)] mb-[12px]" aria-hidden="true" />
        {chips.length > 0 && (
          <div className="flex gap-[6px] overflow-x-auto no-scrollbar mb-[18px] -mx-[20px] px-[20px]">
            {chips.map((item) => {
              const active = item.id === activeId;
              const cls = `${chipClass(active)} shrink-0 no-underline hover:opacity-100`;
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
        <Detail route={route} activeId={activeId} filter={filter} setFilter={setFilter} mobile />
      </div>
    </div>
  );
};
