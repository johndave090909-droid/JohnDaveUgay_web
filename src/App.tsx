import React, { useEffect, useState } from 'react';
import { Landing } from './components/Landing';
import { SiteHeader } from './components/SiteHeader';
import { SiteFooter } from './components/SiteFooter';
import { pageById, parseHash, scrollToId, scrollToTop, useRoute, type Route } from './lib/hashRoute';
import { profile } from './data/profile';
import { projects } from './data/projects';
import { caseStudies } from './data/caseStudies';
import { AboutView } from './views/AboutView';
import { ProjectDetail, ProjectsView, type Filter } from './views/ProjectsView';
import { RecommendationsView } from './views/RecommendationsView';
import { CaseStudiesView, CaseStudyDetail } from './views/CaseStudiesView';
import { ResumeView } from './views/ResumeView';
import { HowIWorkView } from './views/HowIWorkView';
import { LinksView } from './views/LinksView';

function PageView({ route, filter, setFilter }: { route: Route; filter: Filter; setFilter: (f: Filter) => void }) {
  switch (route.page) {
    case 'projects': {
      const p = route.item ? projects.find((x) => x.id === route.item) : undefined;
      return p ? <ProjectDetail project={p} /> : <ProjectsView filter={filter} setFilter={setFilter} />;
    }
    case 'case-studies': {
      const cs = route.item ? caseStudies.find((x) => x.id === route.item) : undefined;
      return cs ? <CaseStudyDetail cs={cs} /> : <CaseStudiesView />;
    }
    case 'recommendations':
      return <RecommendationsView />;
    case 'resume':
      return <ResumeView />;
    case 'how-i-work':
      return <HowIWorkView />;
    case 'links':
      return <LinksView />;
    default:
      return <AboutView />;
  }
}

/** A single project or case study, which carries its own previous/next links. */
const isDetail = (route: Route) =>
  (route.page === 'projects' && projects.some((p) => p.id === route.item)) ||
  (route.page === 'case-studies' && caseStudies.some((c) => c.id === route.item));

/** Tab title for a route: the page, and the project or case study when one is open. */
function titleFor(route: Route): string {
  if (route.page === 'home') return `${profile.name} · Portfolio`;
  const page = pageById(route.page)?.label ?? '';
  const item =
    route.page === 'projects'
      ? projects.find((p) => p.id === route.item)?.title
      : route.page === 'case-studies'
        ? caseStudies.find((c) => c.id === route.item)?.kicker
        : undefined;
  return [item, page, profile.name].filter(Boolean).join(' · ');
}

export default function App() {
  const route = useRoute();
  const [filter, setFilter] = useState<Filter>('all');
  const home = route.page === 'home';

  // The landing page is a single fixed screen; every other page scrolls normally
  useEffect(() => {
    document.documentElement.classList.toggle('landing', home);
  }, [home]);

  useEffect(() => {
    document.title = titleFor(route);
  }, [route]);

  // A new page opens at its top. A recommendation link opens its page at that recommendation.
  useEffect(() => {
    if (home) return;
    if (route.page === 'recommendations' && route.item) {
      const id = `rec-${route.item}`;
      requestAnimationFrame(() => scrollToId(id, false));
      return;
    }
    window.scrollTo(0, 0);
  }, [route, home]);

  // Clicking a link to the page already open goes back to its top
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const href = (e.target as Element | null)?.closest('a')?.getAttribute('href');
      if (href && href.startsWith('#/') && parseHash(href).page !== 'home' && href === window.location.hash) scrollToTop();
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  if (home) return <Landing />;

  return (
    <div className="min-h-dvh flex flex-col bg-black">
      <SiteHeader current={route.page} />
      <main id="main" className="flex-1">
        <div key={`${route.page}/${route.item ?? ''}`} className="rise">
          <PageView route={route} filter={filter} setFilter={setFilter} />
        </div>
      </main>
      <SiteFooter current={route.page} pageNav={!isDetail(route)} />
    </div>
  );
}
