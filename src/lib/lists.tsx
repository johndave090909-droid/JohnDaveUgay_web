import type { ListItem } from '../components/IndexList';
import { hrefFor, type SectionId } from './hashRoute';
import { links, profile } from '../data/profile';
import { projects, type ProjectTag } from '../data/projects';
import { caseStudies } from '../data/caseStudies';
import { principles } from '../data/howIWork';
import { recommendations } from '../data/recommendations';
import { RESUME_PDF } from '../data/resume';

export type Filter = 'all' | ProjectTag;

export const filterProjects = (filter: Filter) =>
  filter === 'all' ? projects : projects.filter((p) => p.tags.includes(filter));

/** What the left-hand index shows for each section. On the home page it follows the part being read. */
export function getList(section: SectionId, filter: Filter): ListItem[] {
  switch (section) {
    case 'projects': {
      return filterProjects(filter).map<ListItem>((p) => ({
        id: p.id,
        kind: 'route',
        href: hrefFor('projects', p.id),
        left: p.title,
        right: p.kicker,
        thumb: { code: p.code, stat: p.stat, image: p.image },
      }));
    }

    case 'case-studies': {
      const items: ListItem[] = caseStudies.map((c) => ({
        id: c.id,
        kind: 'route',
        href: hrefFor('case-studies', c.id),
        left: c.kicker,
        right: `${c.org.includes('Polynesian') ? 'PCC' : c.org} /\n${c.year}`,
        thumb: { code: c.metric.value, stat: c.year },
      }));
      return items;
    }

    case 'resume': {
      const items: ListItem[] = [
        { id: 'resume-download', kind: 'link', href: RESUME_PDF, left: 'Download PDF', right: 'new tab' },
        { id: 'resume-profile', kind: 'anchor', left: 'Profile', right: '01' },
        { id: 'resume-experience', kind: 'anchor', left: 'Experience', right: '02' },
        { id: 'resume-education', kind: 'anchor', left: 'Education', right: '03' },
        { id: 'resume-projects', kind: 'anchor', left: 'Projects', right: '04' },
        { id: 'resume-skills', kind: 'anchor', left: 'Skills & languages', right: '05' },
      ];
      return items;
    }

    case 'how-i-work': {
      const items: ListItem[] = [
        ...principles.map<ListItem>((p) => ({ id: p.id, kind: 'anchor', left: p.title, right: p.num })),
        { id: 'toolkit', kind: 'anchor', left: 'Toolkit', right: '07' },
        { id: 'where', kind: 'anchor', left: 'Where I am', right: '08' },
      ];
      return items;
    }

    case 'recommendations': {
      if (recommendations.length > 0) {
        const items: ListItem[] = recommendations.map((r) => ({
          id: r.id,
          kind: 'route',
          href: hrefFor('recommendations', r.id),
          left: r.name,
          right: r.role,
        }));
        return items;
      }
      const items: ListItem[] = [
        { id: 'slot-1', kind: 'static', left: 'Slot 01', right: 'open' },
        { id: 'slot-2', kind: 'static', left: 'Slot 02', right: 'open' },
        { id: 'slot-3', kind: 'static', left: 'Slot 03', right: 'open' },
        {
          id: 'add-yours',
          kind: 'link',
          href: `mailto:${profile.email}?subject=${encodeURIComponent('A few words for your portfolio')}`,
          left: 'Add yours',
          right: 'email',
        },
      ];
      return items;
    }

    case 'links': {
      const items: ListItem[] = links.map((l) =>
        l.url
          ? { id: l.id, kind: 'link', href: l.url, left: l.label, right: l.handle }
          : { id: l.id, kind: 'static', left: l.label, right: 'add link' }
      );
      return items;
    }

    default: {
      const items: ListItem[] = [
        { id: 'based', kind: 'static', left: 'Based', right: `${profile.location}\n${profile.timezone}` },
        { id: 'from', kind: 'static', left: 'From', right: profile.origin },
        { id: 'study', kind: 'static', left: 'Study', right: 'BYU–Hawaii\nB.S. SCM, IT minor\nDec 2027 · GPA 3.9' },
        { id: 'work', kind: 'static', left: 'Work', right: 'PCC Culinary\nAI, Software &\nSystems Specialist' },
        { id: 'studio', kind: 'static', left: 'Studio', right: 'NathanWORKS' },
        { id: 'languages', kind: 'static', left: 'Languages', right: profile.languages.replace(/, /g, '\n') },
        { id: 'status', kind: 'static', left: 'Status', right: profile.availability },
      ];
      return items;
    }
  }
}
