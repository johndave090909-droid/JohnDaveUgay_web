import React, { useEffect, useRef } from 'react';
import { Thumb, type ThumbProps } from './Thumb';
import { scrollContentTo } from '../lib/hashRoute';

export type ListItemKind = 'route' | 'anchor' | 'link' | 'static';

export interface ListItem {
  id: string;
  /** Left title, white. A newline splits it over two lines. */
  left: string;
  /** Right title, muted. */
  right?: string;
  kind: ListItemKind;
  /** For 'route' and 'link' kinds. */
  href?: string;
  thumb?: Omit<ThumbProps, 'seed'>;
}

interface IndexListProps {
  items: ListItem[];
  activeId?: string;
}

/** The left-hand index: the section's cards or rows, in the style of a logbook. Desktop only. */
export const IndexList: React.FC<IndexListProps> = ({ items, activeId }) => {
  const dense = items.every((i) => !i.thumb);
  const boxRef = useRef<HTMLDivElement>(null);

  // Keep the active row on screen while the content column scrolls past it
  useEffect(() => {
    const box = boxRef.current;
    const row = activeId ? box?.querySelector<HTMLElement>(`[data-id="${activeId}"]`) : null;
    if (!box || !row) return;
    const top = row.offsetTop;
    const bottom = top + row.offsetHeight;
    if (top < box.scrollTop + 24) box.scrollTo({ top: top - 24, behavior: 'smooth' });
    else if (bottom > box.scrollTop + box.clientHeight - 48)
      box.scrollTo({ top: bottom - box.clientHeight + 48, behavior: 'smooth' });
  }, [activeId]);

  return (
    <div
      ref={boxRef}
      className="list absolute top-[244px] min-[1280px]:top-[120px] left-[24px] bottom-0 w-[320px] overflow-y-auto no-scrollbar pointer-events-auto z-10 hidden md:block select-none fade-y"
      style={{ scrollbarWidth: 'none', isolation: 'isolate' }}
    >
      <div className="rise relative pt-[20px] pb-[64px] flex flex-col">
        {items.map((item, idx) => (
          <Row key={item.id} item={item} active={item.id === activeId} first={idx === 0} dense={dense} />
        ))}
      </div>
    </div>
  );
};

const Row: React.FC<{ item: ListItem; active: boolean; first: boolean; dense: boolean }> = ({
  item,
  active,
  first,
  dense,
}) => {
  const body = (
    <>
      {item.thumb && (
        <div
          className={`thumb h-[160px] rounded-[2px] bg-[#0a0a0a] overflow-hidden relative transition-opacity duration-300 ${
            active ? 'outline outline-1 outline-[var(--accent)]' : 'opacity-80'
          }`}
        >
          <Thumb seed={item.id} {...item.thumb} />
        </div>
      )}
      <div
        className={`meta flex justify-between gap-[16px] ${item.thumb ? 'mt-[10px]' : ''} text-[12px] leading-[1.35]`}
      >
        <div className={`${active ? 'text-[var(--accent)]' : 'text-white'} whitespace-pre-line text-left`}>
          {item.left}
        </div>
        {item.right && (
          <div
            className={`${
              item.kind === 'static' ? 'text-[var(--text)]' : 'text-[var(--muted)]'
            } whitespace-pre-line text-right shrink-0 max-w-[60%]`}
          >
            {item.right}
          </div>
        )}
      </div>
    </>
  );

  const pad = dense ? 'py-[11px]' : 'py-[18px]';
  const border = `${pad} border-t border-[var(--line)] ${first ? 'border-t-0' : ''}`;
  const hover = 'transition-opacity duration-300 hover:opacity-70';

  switch (item.kind) {
    case 'route':
      return (
        <article data-id={item.id} className={`card ${border}`}>
          <a href={item.href} className={`block no-underline hover:opacity-100 ${active ? '' : hover}`}>
            {body}
          </a>
        </article>
      );
    case 'link':
      return (
        <article data-id={item.id} className={`card ${border}`}>
          <a
            href={item.href}
            target="_blank"
            rel="noreferrer"
            className={`block no-underline hover:opacity-100 ${hover}`}
          >
            {body}
          </a>
        </article>
      );
    case 'anchor':
      return (
        <article data-id={item.id} className={`card ${border}`}>
          <button type="button" onClick={() => scrollContentTo(item.id)} className={`block w-full text-left ${hover}`}>
            {body}
          </button>
        </article>
      );
    default:
      return <article data-id={item.id} className={`card ${border}`}>{body}</article>;
  }
};
