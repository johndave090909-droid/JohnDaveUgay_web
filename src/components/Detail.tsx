import React from 'react';
import { isHome, type Route } from '../lib/hashRoute';
import type { Filter } from '../lib/lists';
import { HomeView } from '../views/HomeView';
import { CaseStudiesView } from '../views/CaseStudiesView';
import { ResumeView } from '../views/ResumeView';
import { HowIWorkView } from '../views/HowIWorkView';
import { LinksView } from '../views/LinksView';

interface DetailProps {
  route: Route;
  activeId?: string;
  filter: Filter;
  setFilter: (f: Filter) => void;
  /** On phones the content sits inside the bottom sheet instead of the right-hand column. */
  mobile?: boolean;
}

function View({ route, activeId, filter, setFilter }: Omit<DetailProps, 'mobile'>) {
  switch (route.section) {
    case 'case-studies':
      return <CaseStudiesView activeId={activeId} />;
    case 'resume':
      return <ResumeView />;
    case 'how-i-work':
      return <HowIWorkView />;
    case 'links':
      return <LinksView />;
    default:
      return <HomeView route={route} filter={filter} setFilter={setFilter} />;
  }
}

/** The right-hand column: the scrolling home page, or the page that is open. */
export const Detail: React.FC<DetailProps> = ({ mobile, ...props }) => {
  // The home page stays mounted while moving between its parts; other pages re-enter on every change
  const key = isHome(props.route.section) ? 'home' : `${props.route.section}/${props.activeId ?? ''}`;

  if (mobile) {
    return (
      <div key={key} className="rise select-text text-[13px] leading-[1.45] tracking-[0.02em]">
        <View {...props} />
      </div>
    );
  }

  return (
    <aside
      id="content"
      className="about absolute z-10 pointer-events-auto select-text
        w-[480px] right-[90px] top-[120px] bottom-[24px]
        max-[1180px]:right-[24px] max-[1180px]:w-[380px]
        overflow-y-auto no-scrollbar fade-y
        text-[13px] leading-[1.45] text-[var(--text)] tracking-[0.02em]"
      style={{ scrollbarWidth: 'none' }}
    >
      <div key={key} className="rise pt-[20px] pb-[48px]">
        <View {...props} />
      </div>
    </aside>
  );
};
