import React from 'react';
import { PROJECT_TAGS, projects, tagLabel, type Project } from '../data/projects';
import { caseStudies } from '../data/caseStudies';
import { profile } from '../data/profile';
import { hrefFor } from '../lib/hashRoute';
import { filterProjects, type Filter } from '../lib/lists';
import { Arrow, Block, Chips, Prose, chipClass } from '../components/ui';

interface ProjectsViewProps {
  filter: Filter;
  setFilter: (f: Filter) => void;
  /** Project whose highlights start open: the one the URL points at. */
  openId?: string;
}

/** Every project in one list, part of the home page. Highlights fold away so the list stays scannable. */
export const ProjectsView: React.FC<ProjectsViewProps> = ({ filter, setFilter, openId }) => {
  const list = filterProjects(filter);

  return (
    <>
      <div className="flex flex-wrap gap-[6px]" role="group" aria-label="Filter projects">
        {PROJECT_TAGS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setFilter(t.id)}
            aria-pressed={filter === t.id}
            className={chipClass(filter === t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-[10px] mb-[6px] text-[11px] text-[var(--muted)]">
        {list.length === projects.length
          ? `${projects.length} projects`
          : `${list.length} of ${projects.length} projects`}
      </div>

      {list.map((p) => (
        <ProjectEntry key={p.id} p={p} open={p.id === openId} />
      ))}

      <Block title="code">
        <Prose>
          <p>
            The Polynesian Cultural Center projects belong to the PCC, so there is no public repository for them.
            I am happy to walk through the architecture on a call.
          </p>
        </Prose>
        <div className="mt-[1em]">
          <Arrow label="Mail" value={profile.email} href={`mailto:${profile.email}`} />
        </div>
      </Block>
    </>
  );
};

const ProjectEntry: React.FC<{ p: Project; open: boolean }> = ({ p, open }) => {
  const cs = p.caseStudy ? caseStudies.find((c) => c.id === p.caseStudy) : undefined;
  const hasLinks = (p.links && p.links.length > 0) || cs;

  return (
    <article id={`project-${p.id}`} data-project={p.id} className="py-[26px] border-b border-[var(--line)]">
      <div className="text-[11px] text-[var(--muted)]">
        {p.code} · {p.org} · {p.year}
      </div>
      <h2 className="mt-[8px] mb-0 text-[16px] leading-[1.3] text-white font-medium tracking-[0.02em]">{p.title}</h2>
      <div className="mt-[6px] text-[11px] text-[var(--muted)]">{p.tags.map(tagLabel).join(' · ')}</div>

      <Prose className="mt-[14px]">
        <p>{p.summary}</p>
      </Prose>

      <details open={open} className="fold mt-[12px]">
        <summary>Highlights · {p.highlights.length}</summary>
        <Prose className="mt-[10px]">
          <ul>
            {p.highlights.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </Prose>
      </details>

      <div className="mt-[16px]">
        <Chips items={p.stack} />
      </div>

      {hasLinks && (
        <div className="mt-[12px] flex flex-col">
          {p.links?.map((l) => (
            <Arrow key={l.url} label={l.label} value={l.url.replace(/^https?:\/\//, '')} href={l.url} external />
          ))}
          {cs && <Arrow label="Case study" value={cs.title} href={hrefFor('case-studies', cs.id)} />}
        </div>
      )}
    </article>
  );
};
