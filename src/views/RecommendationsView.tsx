import React from 'react';
import { recommendations } from '../data/recommendations';
import { links, profile } from '../data/profile';
import { Button, ButtonRow, Container, EXT, Note, PageIntro, Reading } from '../components/ui';

const ask = `mailto:${profile.email}?subject=${encodeURIComponent('A few words for your portfolio')}`;
const linkedin = links.find((l) => l.id === 'linkedin')?.url;

/** Recommendations in full, or a short note while there are none yet. */
export const RecommendationsView: React.FC = () => (
  <Container>
    <PageIntro
      eyebrow="03 · Recommendations"
      title="Recommendations"
      lead="What people I have worked with say about working with me."
    />

    {recommendations.length === 0 ? (
      <Note className="mt-[40px]">
        <h2 className="m-0 text-[20px] font-semibold text-white">Coming soon</h2>
        <Reading className="mt-[10px]">
          <p>
            I am collecting these now. If we have worked together and you would like to add a few words, email me and I
            will put them here with your name, your role and when we worked together.
          </p>
        </Reading>
        <ButtonRow className="mt-[22px]">
          <Button href={ask}>Email me a recommendation</Button>
          {linkedin && (
            <Button href={linkedin} variant="secondary" external>
              Recommend me on LinkedIn {EXT}
            </Button>
          )}
        </ButtonRow>
      </Note>
    ) : (
      <>
        <ul className="m-0 mt-[40px] p-0 list-none flex flex-col gap-[20px]">
          {recommendations.map((r) => (
            <li key={r.id} id={`rec-${r.id}`} className="anchor">
              <figure className="m-0 rounded-[16px] border border-[var(--line)] bg-[var(--card)] p-[24px] sm:p-[28px]">
                <blockquote className="m-0">
                  <p className="m-0 text-[18px] sm:text-[19px] leading-[1.7] text-white">“{r.quote}”</p>
                </blockquote>
                <figcaption className="mt-[18px] pt-[16px] border-t border-[var(--line)]">
                  <span className="block text-[17px] font-semibold text-white">{r.name}</span>
                  <span className="block mt-[2px] text-[15px] text-[var(--muted)]">
                    {r.role} · {r.relationship} · {r.date}
                  </span>
                  {r.link && (
                    <a
                      href={r.link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-block mt-[8px] text-[15px] text-[var(--accent)] underline underline-offset-[4px]"
                    >
                      See the original {EXT}
                    </a>
                  )}
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <Note className="mt-[32px]">
          <Reading>
            <p>Worked with me? I would be glad to add your words here.</p>
          </Reading>
          <ButtonRow className="mt-[16px]">
            <Button href={ask}>Email me a recommendation</Button>
          </ButtonRow>
        </Note>
      </>
    )}
  </Container>
);
