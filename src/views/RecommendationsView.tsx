import React from 'react';
import { recommendations } from '../data/recommendations';
import { profile } from '../data/profile';
import { Arrow, Block, Meta, Prose } from '../components/ui';

const SUBJECT = encodeURIComponent('A few words for your portfolio');

/** Part of the home page. Shows every recommendation in turn, or the "collecting" state while there are none. */
export const RecommendationsView: React.FC = () => {
  if (recommendations.length === 0) {
    return (
      <>
        <Block title="status">
          <Prose>
            <p>
              This section is being filled in. If we have worked together and you would like to add a few
              words, email me and I will put them here with your name, role and the dates we worked together.
            </p>
          </Prose>
          <div className="mt-[1em] flex flex-col">
            <Arrow
              label="Mail"
              value={profile.email}
              href={`mailto:${profile.email}?subject=${SUBJECT}`}
            />
            <Arrow label="LinkedIn" value="recommendations also welcome there" href="https://www.linkedin.com/in/john-dave-ugay-361b02250" external />
          </div>
        </Block>
        <Block title="reserved">
          <div className="flex flex-col gap-[10px]">
            {['01', '02', '03'].map((n) => (
              <div key={n} className="border border-dashed border-[var(--line)] rounded-[2px] p-[12px]">
                <Meta left={`Slot ${n}`} right="open" leftClass="text-[var(--muted)]" />
              </div>
            ))}
          </div>
        </Block>
      </>
    );
  }

  return (
    <>
      {recommendations.map((r) => (
        <article key={r.id} id={`rec-${r.id}`} className="mb-[2.2em]">
          <Meta left={r.name} right={r.date} />
          <div className="text-[11px] text-[var(--muted)] mt-[3px] normal-case">
            {r.role} · {r.relationship}
          </div>
          <Prose className="mt-[10px]">
            <p>“{r.quote}”</p>
          </Prose>
          {r.link && (
            <div className="mt-[6px]">
              <Arrow label="Source" value={r.link.replace(/^https?:\/\//, '')} href={r.link} external />
            </div>
          )}
        </article>
      ))}
      <Block title="add yours">
        <Arrow label="Mail" value={profile.email} href={`mailto:${profile.email}?subject=${SUBJECT}`} />
      </Block>
    </>
  );
};
