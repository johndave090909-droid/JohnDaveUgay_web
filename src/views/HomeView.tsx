import React from 'react';
import { profile } from '../data/profile';
import { recommendations } from '../data/recommendations';
import { SECTIONS, type Route, type SectionId } from '../lib/hashRoute';
import type { Filter } from '../lib/lists';
import { SectionHead } from '../components/ui';
import { AboutView } from './AboutView';
import { ProjectsView } from './ProjectsView';
import { RecommendationsView } from './RecommendationsView';

interface HomeViewProps {
  route: Route;
  filter: Filter;
  setFilter: (f: Filter) => void;
}

const Part: React.FC<{ id: SectionId; note?: string; children: React.ReactNode }> = ({ id, note, children }) => {
  const s = SECTIONS.find((x) => x.id === id)!;
  return (
    <section id={`home-${id}`} className="mt-[72px] first:mt-0">
      <SectionHead num={s.num} label={s.label} note={note} />
      {children}
    </section>
  );
};

/** About, Projects and Recommendations as one scrolling page. */
export const HomeView: React.FC<HomeViewProps> = ({ route, filter, setFilter }) => (
  <>
    <Part id="about" note={profile.location}>
      <AboutView />
    </Part>
    <Part id="projects" note="2025 – now">
      <ProjectsView
        filter={filter}
        setFilter={setFilter}
        openId={route.section === 'projects' ? route.item : undefined}
      />
    </Part>
    <Part id="recommendations" note={recommendations.length ? `${recommendations.length} so far` : 'Collecting'}>
      <RecommendationsView />
    </Part>
  </>
);
