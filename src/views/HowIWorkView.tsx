import React from 'react';
import { principles, toolkit } from '../data/howIWork';
import { profile } from '../data/profile';
import { Container, OnThisPage, PageIntro, Reading, Section } from '../components/ui';

export const HowIWorkView: React.FC = () => (
  <Container>
    <PageIntro
      eyebrow="06 · How I work"
      title="How I work"
      lead="Six habits, each one learned the hard way."
    >
      <OnThisPage
        items={[
          { id: 'habits', label: 'The habits' },
          { id: 'toolkit', label: 'Toolkit' },
          { id: 'where', label: 'Where I am' },
        ]}
      />
    </PageIntro>

    <section id="habits" className="anchor mt-[48px]">
      <h2 className="sr-only">The habits</h2>
      <ol className="m-0 p-0 list-none border-t border-[var(--line)]">
        {principles.map((p) => (
          <li key={p.id} id={p.id} className="anchor py-[28px] border-b border-[var(--line)]">
            <div className="flex gap-[18px] sm:gap-[24px]">
              <span className="font-mono text-[15px] text-[var(--accent)] pt-[4px] shrink-0">{p.num}</span>
              <div className="min-w-0">
                <h3 className="m-0 text-[21px] leading-[1.35] font-semibold text-white">{p.title}</h3>
                <Reading className="mt-[10px]">
                  <p>{p.body}</p>
                </Reading>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>

    <Section title="Toolkit" id="toolkit">
      <dl className="m-0 border-t border-[var(--line)]">
        {toolkit.map((t) => (
          <div key={t.group} className="grid gap-[2px] sm:grid-cols-[120px_1fr] sm:gap-[24px] py-[14px] border-b border-[var(--line)]">
            <dt className="font-mono text-[12.5px] uppercase tracking-[0.08em] text-[var(--muted)] sm:pt-[3px]">{t.group}</dt>
            <dd className="m-0 text-[17px] leading-[1.6] text-white">{t.items}</dd>
          </div>
        ))}
      </dl>
    </Section>

    <Section title="Where I am" id="where">
      <Reading>
        <p>
          {profile.location}, {profile.timezone}. I am used to working with people in the Philippines, Hawaii and the US
          mainland in the same week, so I keep decisions in writing and ship in small steps that do not need a meeting to
          land.
        </p>
      </Reading>
    </Section>
  </Container>
);
