import React from 'react';
import { PROJECT_TAGS, projects, tagLabel, type Project, type ProjectImage, type ProjectTag } from '../data/projects';
import { caseStudies } from '../data/caseStudies';
import { profile } from '../data/profile';
import { hrefFor } from '../lib/hashRoute';
import { Thumb } from '../components/Thumb';
import {
  BackLink,
  Chips,
  Container,
  Eyebrow,
  LinkList,
  LinkRow,
  Note,
  PageIntro,
  PrevNext,
  Reading,
  Section,
} from '../components/ui';

export type Filter = 'all' | ProjectTag;

export const filterProjects = (filter: Filter) =>
  filter === 'all' ? projects : projects.filter((p) => p.tags.includes(filter));

interface ProjectsViewProps {
  filter: Filter;
  setFilter: (f: Filter) => void;
}

/** Every project as a card. A card opens the project's own page. */
export const ProjectsView: React.FC<ProjectsViewProps> = ({ filter, setFilter }) => {
  const list = filterProjects(filter);

  return (
    <Container wide>
      <div className="max-w-[760px]">
        <PageIntro
          eyebrow="02 · Projects"
          title="Projects"
          lead="Things I have built at work, for clients and to learn. Choose one to read the details."
        />
      </div>

      <div className="mt-[32px]">
        <p className="m-0 mb-[10px] font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--muted)]">Show</p>
        <div className="flex flex-wrap gap-[8px]" role="group" aria-label="Filter projects">
          {PROJECT_TAGS.map((t) => {
            const active = filter === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setFilter(t.id)}
                aria-pressed={active}
                className={`min-h-[40px] px-[16px] rounded-full text-[15px] cursor-pointer transition-colors border ${
                  active
                    ? 'bg-white text-black border-white font-medium'
                    : 'bg-transparent text-[#dcdcdc] border-[#3a3a3a] hover:border-white hover:text-white'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>
        <p className="mt-[16px] mb-0 text-[15px] text-[var(--muted)]" aria-live="polite">
          {list.length === projects.length
            ? `${projects.length} projects`
            : `Showing ${list.length} of ${projects.length} projects`}
        </p>
      </div>

      <ul className="m-0 mt-[20px] p-0 list-none grid gap-[20px] sm:grid-cols-2 lg:grid-cols-3">
        {list.map((p) => (
          <li key={p.id}>
            <ProjectCard p={p} />
          </li>
        ))}
      </ul>

      <Note className="mt-[48px] max-w-[760px]">
        <h2 className="m-0 text-[19px] font-semibold text-white">About the code</h2>
        <Reading className="mt-[8px]">
          <p>
            I built the Polynesian Cultural Center projects myself. They belong to the PCC, so there is no public
            repository for them. I am happy to walk through the architecture on a call.{' '}
            <a href={`mailto:${profile.email}`} className="text-[var(--accent)] underline underline-offset-[4px]">
              Email me
            </a>
            .
          </p>
        </Reading>
      </Note>
    </Container>
  );
};

const ProjectCard: React.FC<{ p: Project }> = ({ p }) => (
  <a
    href={hrefFor('projects', p.id)}
    className="group flex flex-col h-full rounded-[16px] border border-[var(--line)] bg-[var(--card)] overflow-hidden no-underline hover:border-[#4d4d4d] transition-colors"
  >
    <div className="aspect-[2/1] bg-[#0a0a0a] overflow-hidden border-b border-[var(--line)]">
      <Thumb seed={p.id} code={p.code} stat={p.stat} image={p.image} />
    </div>
    <div className="flex flex-col flex-1 p-[20px]">
      <p className="m-0 flex flex-wrap items-center gap-x-[10px] gap-y-[4px] text-[14px] text-[var(--muted)]">
        <span>
          {p.org} · {p.year}
        </span>
        {p.links?.some((l) => l.live) && (
          <span className="inline-flex items-center gap-[6px] px-[8px] py-[1px] rounded-full border border-[rgba(170,136,255,0.5)] text-[12.5px] text-[var(--accent-soft)]">
            <span aria-hidden="true" className="w-[6px] h-[6px] rounded-full bg-[var(--accent)]" />
            Live
          </span>
        )}
      </p>
      <h2 className="mt-[6px] mb-0 text-[20px] leading-[1.3] font-semibold text-white">{p.title}</h2>
      <p className="mt-[10px] mb-0 text-[15.5px] leading-[1.6] text-[#cfcfcf] line-clamp-3">{p.summary}</p>
      <span className="mt-auto pt-[16px] inline-flex items-center gap-[6px] text-[15px] font-medium text-[var(--accent)]">
        Read more
        <span aria-hidden="true" className="transition-transform group-hover:translate-x-[3px]">
          →
        </span>
      </span>
    </div>
  </a>
);

const mediaClass = 'block w-full rounded-[14px] border border-[var(--line)] bg-[#0a0a0a]';

// A screenshot shows whole, at its own shape. A clip plays muted on a loop; with reduced motion it waits on
// its still with controls instead (clips keep a fixed frame so the page does not jump while they load).
const Media: React.FC<{ image: ProjectImage }> = ({ image }) => {
  if (!image.video) {
    return <img src={image.src} alt={image.alt} className={`${mediaClass} h-auto`} />;
  }
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  return (
    <video
      src={image.video}
      poster={image.src}
      aria-label={image.alt}
      muted
      loop
      playsInline
      autoPlay={!reduce}
      controls={reduce}
      preload={reduce ? 'none' : 'metadata'}
      className={`${mediaClass} aspect-[16/9] object-cover`}
      style={{ objectPosition: image.position }}
    />
  );
};

/** One project on its own page: what it is, the highlights, what it is built with, and where to see more. */
export const ProjectDetail: React.FC<{ project: Project }> = ({ project: p }) => {
  const cs = p.caseStudy ? caseStudies.find((c) => c.id === p.caseStudy) : undefined;
  const i = projects.findIndex((x) => x.id === p.id);
  const prev = projects[i - 1];
  const next = projects[i + 1];

  return (
    <Container>
      <BackLink href={hrefFor('projects')}>All projects</BackLink>

      <header className="pt-[28px]">
        <Eyebrow>{p.tags.map(tagLabel).join(' · ')}</Eyebrow>
        <h1 className="mt-[12px] mb-0 text-[32px] sm:text-[40px] leading-[1.15] font-semibold text-white tracking-[-0.01em]">
          {p.title}
        </h1>
        <div className="mt-[14px] flex flex-wrap items-center gap-x-[14px] gap-y-[8px] text-[16px] text-[var(--muted)]">
          <span>
            {p.org} · {p.year}
          </span>
          {p.stat && (
            <span className="px-[12px] py-[4px] rounded-full border border-[rgba(170,136,255,0.5)]text-[14px] text-[var(--accent-soft)]">
              {p.stat}
            </span>
          )}
        </div>
      </header>

      {p.image && (
        <div className="mt-[32px]">
          <Media image={p.image} />
        </div>
      )}

      <Reading className="mt-[32px]">
        <p className="text-[18px] sm:text-[19px] leading-[1.7] text-white">{p.summary}</p>
      </Reading>

      <Section title="Highlights">
        <Reading>
          <ul>
            {p.highlights.map((h, k) => (
              <li key={k}>{h}</li>
            ))}
          </ul>
        </Reading>
      </Section>

      <Section title="Built with">
        <Chips items={p.stack} />
      </Section>

      {((p.links && p.links.length > 0) || cs) && (
        <Section title="See more">
          <LinkList>
            {cs && <LinkRow label="Read the case study" detail={cs.title} href={hrefFor('case-studies', cs.id)} />}
            {p.links?.map((l) => (
              <LinkRow key={l.url} label={l.label} detail={l.url.replace(/^https?:\/\//, '')} href={l.url} external />
            ))}
          </LinkList>
        </Section>
      )}

      <PrevNext
        noun="project"
        prev={prev && { href: hrefFor('projects', prev.id), label: prev.title }}
        next={next && { href: hrefFor('projects', next.id), label: next.title }}
      />
    </Container>
  );
};
