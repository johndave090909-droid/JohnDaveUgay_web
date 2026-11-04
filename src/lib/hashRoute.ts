import { useEffect, useState } from 'react';

export type SectionId =
  | 'about'
  | 'projects'
  | 'recommendations'
  | 'case-studies'
  | 'resume'
  | 'how-i-work'
  | 'links';

export interface Section {
  id: SectionId;
  label: string;
  num: string;
  /** Part of the scrolling home page rather than a page of its own. */
  home?: boolean;
}

export const SECTIONS: Section[] = [
  { id: 'about', label: 'About', num: '01', home: true },
  { id: 'projects', label: 'Projects', num: '02', home: true },
  { id: 'recommendations', label: 'Recommendations', num: '03', home: true },
  { id: 'case-studies', label: 'Case studies', num: '04' },
  { id: 'resume', label: 'Resume', num: '05' },
  { id: 'how-i-work', label: 'How I work', num: '06' },
  { id: 'links', label: 'Around the web', num: '07' },
];

export const HOME_SECTIONS = SECTIONS.filter((s) => s.home).map((s) => s.id);

export const isHome = (s: SectionId) => HOME_SECTIONS.includes(s);

export interface Route {
  section: SectionId;
  item?: string;
}

const isSection = (s: string): s is SectionId => SECTIONS.some((x) => x.id === s);

/** URL shape: #/section or #/section/item */
export function parseHash(hash: string = window.location.hash): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  const section = parts[0] && isSection(parts[0]) ? parts[0] : 'about';
  const item = parts[1] ? decodeURIComponent(parts[1]) : undefined;
  return { section, item };
}

export function hrefFor(section: SectionId, item?: string): string {
  return item ? `#/${section}/${encodeURIComponent(item)}` : `#/${section}`;
}

/** Element id on the home page that a home route scrolls to. */
export function homeAnchor(route: Route): string {
  if (route.item && route.section === 'projects') return `project-${route.item}`;
  if (route.item && route.section === 'recommendations') return `rec-${route.item}`;
  return `home-${route.section}`;
}

/** Scrolls the content column (the sheet on phones) to an element, or to the top without one. */
export function scrollContentTo(id?: string, smooth = true) {
  const box = document.getElementById('content');
  if (!box) return;
  const el = id ? document.getElementById(id) : null;
  // Phone layout: a transparent spacer shows the portrait above the panel, and a chip bar may stick to the top
  const hero = box.querySelector<HTMLElement>('[data-hero]')?.offsetHeight ?? 0;
  const sticky = box.querySelector<HTMLElement>('[data-sticky]')?.offsetHeight ?? 0;
  let top: number;
  if (el) {
    top = el.getBoundingClientRect().top - box.getBoundingClientRect().top + box.scrollTop - 20 - sticky;
    // An anchor at the very start of the panel keeps the portrait in view above it
    if (top <= hero + 80) top = 0;
  } else {
    // A new page keeps the panel up if it already was, otherwise the portrait shows first
    top = box.scrollTop > hero ? hero : 0;
  }
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  box.scrollTo({ top: Math.max(0, top), behavior: smooth && !reduce ? 'smooth' : 'auto' });
}

/** Re-scrolls when the URL already matches, since the browser fires no hashchange for that. */
export function revisit(route: Route) {
  scrollContentTo(isHome(route.section) ? homeAnchor(route) : undefined);
}

export function navigate(section: SectionId, item?: string) {
  const next = hrefFor(section, item);
  if (window.location.hash !== next) window.location.hash = next;
  else revisit({ section, item });
}

/** A fresh object on every hashchange, so effects keyed on it re-run even when the route repeats. */
export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseHash());
  useEffect(() => {
    const onChange = () => setRoute(parseHash());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);
  return route;
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

export interface Spy {
  section: SectionId;
  /** Project at the reading line, while the projects part is in view. */
  project?: string;
}

/** Which part of the home page is under the reading line, recomputed as the content column scrolls. */
export function useHomeSpy(enabled: boolean, initial: SectionId, deps: unknown[]): Spy {
  const [spy, setSpy] = useState<Spy>({ section: isHome(initial) ? initial : 'about' });

  useEffect(() => {
    if (!enabled) return;
    const box = document.getElementById('content');
    if (!box) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      const boxTop = box.getBoundingClientRect().top;
      const line = box.clientHeight * 0.3;
      const passed = (el: Element) => el.getBoundingClientRect().top - boxTop <= line;

      let section: SectionId = HOME_SECTIONS[0];
      for (const s of HOME_SECTIONS) {
        const el = document.getElementById(`home-${s}`);
        if (el && passed(el)) section = s;
      }
      // The last part is too short to reach the line, so the bottom of the page counts as it
      if (box.scrollTop + box.clientHeight >= box.scrollHeight - 4) section = HOME_SECTIONS[HOME_SECTIONS.length - 1];

      let project: string | undefined;
      if (section === 'projects') {
        const cards = Array.from(box.querySelectorAll<HTMLElement>('[data-project]'));
        project = cards[0]?.dataset.project;
        for (const c of cards) if (passed(c)) project = c.dataset.project;
      }

      setSpy((prev) => (prev.section === section && prev.project === project ? prev : { section, project }));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    box.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      box.removeEventListener('scroll', onScroll);
      cancelAnimationFrame(frame);
    };
  }, [enabled, ...deps]);

  return spy;
}
