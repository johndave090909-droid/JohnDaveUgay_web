import React from 'react';
import { caseStudies, type CaseStudy } from '../data/caseStudies';
import { projects } from '../data/projects';
import { hrefFor } from '../lib/hashRoute';
import { BackLink, Chips, Container, Eyebrow, LinkList, LinkRow, PageIntro, PrevNext, Reading, Section } from '../components/ui';

/** Every case study as a card with its headline number. */
export const CaseStudiesView: React.FC = () => (
  <Container>
    <PageIntro
      eyebrow="04 · Case studies"
      title="Case studies"
      lead="Longer write-ups of real problems: the situation, what I did, and what changed. Each takes a few minutes to read."
    />

    <ul className="m-0 mt-[40px] p-0 list-none flex flex-col gap-[16px]">
      {caseStudies.map((c) => (
        <li key={c.id}>
          <a
            href={hrefFor('case-studies', c.id)}
            className="group block rounded-[16px] border border-[var(--line)] bg-[var(--card)] p-[22px] sm:p-[26px] no-underline hover:border-[#4d4d4d] transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-start gap-[14px] sm:gap-[26px]">
              <div className="sm:w-[150px] shrink-0">
                <span className="block text-[34px] leading-none font-semibold text-[var(--accent)]">{c.metric.value}</span>
                <span className="block mt-[8px] text-[14px] leading-[1.45] text-[var(--muted)]">{c.metric.label}</span>
              </div>
              <div className="min-w-0">
                <p className="m-0 text-[14.5px] text-[var(--muted)]">
                  {c.kicker} · {c.year}
                </p>
                <h2 className="mt-[6px] mb-0 text-[21px] leading-[1.35] font-semibold text-white">{c.title}</h2>
                <span className="mt-[14px] inline-flex items-center gap-[6px] text-[15px] font-medium text-[var(--accent)]">
                  Read the case study
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-[3px]">
                    →
                  </span>
                </span>
              </div>
            </div>
          </a>
        </li>
      ))}
    </ul>
  </Container>
);

/** One case study, top to bottom. */
export const CaseStudyDetail: React.FC<{ cs: CaseStudy }> = ({ cs }) => {
  const i = caseStudies.findIndex((c) => c.id === cs.id);
  const prev = caseStudies[i - 1];
  const next = caseStudies[i + 1];
  const related = cs.projects.map((id) => projects.find((p) => p.id === id)).filter((p) => p !== undefined);

  return (
    <Container>
      <BackLink href={hrefFor('case-studies')}>All case studies</BackLink>

      <header className="pt-[28px]">
        <Eyebrow>
          {cs.kicker} · {cs.year}
        </Eyebrow>
        <h1 className="mt-[12px] mb-0 text-[30px] sm:text-[38px] leading-[1.18] font-semibold text-white tracking-[-0.01em]">
          {cs.title}
        </h1>
        <p className="mt-[12px] mb-0 text-[16px] text-[var(--muted)]">{cs.org}</p>
      </header>

      <div className="mt-[32px] rounded-[16px] border border-[var(--line)] bg-[var(--card)] p-[22px] flex flex-col sm:flex-row sm:items-center gap-[10px] sm:gap-[20px]">
        <span className="text-[40px] leading-none font-semibold text-[var(--accent)] shrink-0">{cs.metric.value}</span>
        <span className="text-[17px] leading-[1.5] text-white">{cs.metric.label}</span>
      </div>

      <Section title="The situation">
        <Reading>
          <p>{cs.context}</p>
        </Reading>
      </Section>

      <Section title="The problem">
        <Reading>
          <p>{cs.problem}</p>
        </Reading>
      </Section>

      <Section title="What I did">
        <Reading>
          <ol>
            {cs.approach.map((a, k) => (
              <li key={k}>{a}</li>
            ))}
          </ol>
        </Reading>
      </Section>

      <Section title="The result">
        <Reading>
          <ul>
            {cs.result.map((r, k) => (
              <li key={k}>
                <strong>{r}</strong>
              </li>
            ))}
          </ul>
        </Reading>
      </Section>

      <Section title="What I learned">
        <Reading>
          <p>{cs.learned}</p>
        </Reading>
      </Section>

      <Section title="Built with">
        <Chips items={cs.stack} />
      </Section>

      {related.length > 0 && (
        <Section title="Related projects">
          <LinkList>
            {related.map((p) => (
              <LinkRow key={p.id} label={p.title} detail={`${p.org} · ${p.year}`} href={hrefFor('projects', p.id)} />
            ))}
          </LinkList>
        </Section>
      )}

      <PrevNext
        noun="case study"
        prev={prev && { href: hrefFor('case-studies', prev.id), label: prev.kicker }}
        next={next && { href: hrefFor('case-studies', next.id), label: next.kicker }}
      />
    </Container>
  );
};
