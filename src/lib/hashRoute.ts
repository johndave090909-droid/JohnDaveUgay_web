import { useEffect, useState } from 'react';

export type PageId =
  | 'home'
  | 'about'
  | 'projects'
  | 'recommendations'
  | 'case-studies'
  | 'resume'
  | 'how-i-work'
  | 'links';

export interface Page {
  id: Exclude<PageId, 'home'>;
  label: string;
  num: string;
  /** One line under the label in the menus. */
  blurb: string;
  /** The three main pages get the big rows on the landing page. */
  primary?: boolean;
}

// The landing page (#/) shows the portrait; every page below is a plain page of its own.
export const PAGES: Page[] = [
  { id: 'about', label: 'About', num: '01', blurb: 'Who I am, what I do, what I am looking for', primary: true },
  { id: 'projects', label: 'Projects', num: '02', blurb: 'What I have built, at work and on my own', primary: true },
  { id: 'recommendations', label: 'Recommendations', num: '03', blurb: 'What people I have worked with say', primary: true },
  { id: 'case-studies', label: 'Case studies', num: '04', blurb: 'Problems I solved, start to finish' },
  { id: 'resume', label: 'Resume', num: '05', blurb: 'Read it here or download the PDF' },
  { id: 'how-i-work', label: 'How I work', num: '06', blurb: 'The habits behind the work' },
  { id: 'links', label: 'Contact', num: '07', blurb: 'Email, LinkedIn and GitHub' },
];

export const pageById = (id: PageId) => PAGES.find((p) => p.id === id);

export interface Route {
  page: PageId;
  item?: string;
}

const isPage = (s: string): s is PageId => s === 'home' || PAGES.some((p) => p.id === s);

/** URL shape: #/ for the landing page, #/page or #/page/item for the rest. */
export function parseHash(hash: string = window.location.hash): Route {
  const parts = hash.replace(/^#\/?/, '').split('/').filter(Boolean);
  const page = parts[0] && isPage(parts[0]) ? parts[0] : 'home';
  const item = parts[1] ? decodeURIComponent(parts[1]) : undefined;
  return { page, item };
}

export function hrefFor(page: PageId, item?: string): string {
  if (page === 'home') return '#/';
  return item ? `#/${page}/${encodeURIComponent(item)}` : `#/${page}`;
}

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Scrolls the page to an element. Sections carry a scroll margin so they clear the sticky header. */
export function scrollToId(id: string, smooth = true) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: smooth && !reducedMotion() ? 'smooth' : 'auto', block: 'start' });
}

export function scrollToTop(smooth = true) {
  window.scrollTo({ top: 0, behavior: smooth && !reducedMotion() ? 'smooth' : 'auto' });
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
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}
