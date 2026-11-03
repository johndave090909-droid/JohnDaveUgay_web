import React, { useEffect, useMemo, useRef, useState } from 'react';
import { BackgroundCanvas } from './components/BackgroundCanvas';
import { Brand } from './components/Brand';
import { SectionCounter } from './components/SectionCounter';
import { Nav } from './components/Nav';
import { IndexList } from './components/IndexList';
import { Detail } from './components/Detail';
import { MobileSheet } from './components/MobileSheet';
import {
  SECTIONS,
  homeAnchor,
  isHome,
  navigate,
  parseHash,
  revisit,
  scrollContentTo,
  useHomeSpy,
  useMediaQuery,
  useRoute,
  type Route,
} from './lib/hashRoute';
import { getList, type Filter } from './lib/lists';
import { profile } from './data/profile';
import { projects } from './data/projects';
import { caseStudies } from './data/caseStudies';

/** Which case study the detail column shows: the one in the URL if it exists, else the first. */
function resolveCaseStudy(route: Route): string | undefined {
  if (route.section !== 'case-studies') return undefined;
  return caseStudies.some((c) => c.id === route.item) ? route.item : caseStudies[0]?.id;
}

export default function App() {
  const route = useRoute();
  const isMobile = useMediaQuery('(max-width: 760px)');
  const [filter, setFilter] = useState<Filter>('all');
  const onHome = isHome(route.section);

  // Scroll to whatever the URL names. Within the home page that is a glide; arriving from another page is a jump.
  const scrolledFor = useRef<Route | null>(null);
  useEffect(() => {
    const target = route.section === 'projects' && route.item ? projects.find((p) => p.id === route.item) : undefined;
    if (target && filter !== 'all' && !target.tags.includes(filter)) {
      setFilter('all'); // the project is filtered out; scroll once it is back in the list
      return;
    }
    if (scrolledFor.current === route) return;
    const wasHome = scrolledFor.current !== null && isHome(scrolledFor.current.section);
    scrolledFor.current = route;
    if (onHome) scrollContentTo(homeAnchor(route), wasHome);
    else scrollContentTo(undefined, false);
  }, [route, filter, onHome]);

  // On the home page, the nav, counter and index follow the part being read
  const spy = useHomeSpy(onHome, route.section, [isMobile, filter]);
  const current = onHome ? spy.section : route.section;
  const section = SECTIONS.find((s) => s.id === current) ?? SECTIONS[0];
  const items = useMemo(() => getList(current, filter), [current, filter]);
  const activeId = onHome ? spy.project : resolveCaseStudy(route);

  // Tab title follows the page
  useEffect(() => {
    document.title = onHome ? profile.name : `${section.label} · ${profile.name}`;
  }, [onHome, section.label]);

  // A link to the URL already open still scrolls to its target
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const href = (e.target as Element | null)?.closest('a')?.getAttribute('href');
      if (href && href.startsWith('#/') && href === window.location.hash) revisit(parseHash(href));
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  // Left/right arrow keys step through the sections
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      const i = SECTIONS.findIndex((s) => s.id === current);
      if (e.key === 'ArrowRight') navigate(SECTIONS[(i + 1) % SECTIONS.length].id);
      if (e.key === 'ArrowLeft') navigate(SECTIONS[(i - 1 + SECTIONS.length) % SECTIONS.length].id);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [current]);

  return (
    <main className="relative w-screen h-screen overflow-hidden bg-black text-[var(--text)]">
      {/* Layer 1: GPU particle portrait and fluid simulation */}
      <BackgroundCanvas />

      {/* Layer 2: monospace UI */}
      <div className="ui fixed inset-0 z-1 pointer-events-none">
        {/* Shade under the header and the two text columns so the copy stays readable over the dot field */}
        {!isMobile && (
          <>
            <div
              className="absolute inset-x-0 top-0 h-[110px] bg-gradient-to-b from-black/75 to-transparent"
              aria-hidden="true"
            />
            <div className="shade-left absolute inset-y-0 left-0" aria-hidden="true" />
            <div className="shade-right absolute inset-y-0 right-0" aria-hidden="true" />
          </>
        )}
        <Brand />
        <SectionCounter section={section} />
        <Nav active={current} mobile={isMobile} />
        {isMobile ? (
          <MobileSheet route={route} items={items} activeId={activeId} filter={filter} setFilter={setFilter} />
        ) : (
          <>
            <IndexList key={current} items={items} activeId={activeId} />
            <Detail route={route} activeId={activeId} filter={filter} setFilter={setFilter} />
          </>
        )}
      </div>
    </main>
  );
}
