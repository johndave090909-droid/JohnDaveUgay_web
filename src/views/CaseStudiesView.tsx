import React from 'react';
import { caseStudies } from '../data/caseStudies';
import { projects } from '../data/projects';
import { hrefFor } from '../lib/hashRoute';
import { Arrow, Block, Chips, Prose, Title } from '../components/ui';

export const CaseStudiesView: React.FC<{ activeId?: string }> = ({ activeId }) => {
  const idx = Math.max(
    0,
    caseStudies.findIndex((c) => c.id === activeId)
  );
  const cs = caseStudies[idx];
  if (!cs) return null;
  const prev = caseStudies[idx - 1];
  const next = caseStudies[idx + 1];
  const related = cs.projects.map((id) => projects.find((p) => p.id === id)).filter(Boolean);

  return (
    <>
      <div className="mb-[1.6em]">
        <div className="text-[26px] leading-none text-[var(--accent)] font-medium tracking-[0.01em]">
          {cs.metric.value}
        </div>
        <div className="text-[11px] text-[var(--muted)] mt-[8px] normal-case">{cs.metric.label}</div>
      </div>

      <Title kicker={`${cs.kicker} · ${cs.org} · ${cs.year}`}>{cs.title}</Title>

      <Block title="context">
        <Prose>
          <p>{cs.context}</p>
        </Prose>
      </Block>

      <Block title="problem">
        <Prose>
          <p>{cs.problem}</p>
        </Prose>
      </Block>

      <Block title="what i did">
        <Prose>
          <ol>
            {cs.approach.map((a, i) => (
              <li key={i}>{a}</li>
            ))}
          </ol>
        </Prose>
      </Block>

      <Block title="result">
        <Prose>
          <ul>
            {cs.result.map((r, i) => (
              <li key={i}>
                <strong>{r}</strong>
              </li>
            ))}
          </ul>
        </Prose>
      </Block>

      <Block title="what i learned">
        <Prose>
          <p>{cs.learned}</p>
        </Prose>
      </Block>

      <Block title="stack">
        <Chips items={cs.stack} />
      </Block>

      {related.length > 0 && (
        <Block title="related projects">
          <div className="flex flex-col">
            {related.map((p) => (
              <Arrow key={p!.id} label="Project" value={p!.title} href={hrefFor('projects', p!.id)} />
            ))}
          </div>
        </Block>
      )}

      <Block title="more">
        <div className="flex flex-col">
          {prev && <Arrow label="Prev" value={prev.kicker} href={hrefFor('case-studies', prev.id)} />}
          {next && <Arrow label="Next" value={next.kicker} href={hrefFor('case-studies', next.id)} />}
        </div>
      </Block>
    </>
  );
};
