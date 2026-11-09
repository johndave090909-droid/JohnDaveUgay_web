import React from 'react';
import { links, profile } from '../data/profile';
import { projects } from '../data/projects';
import { hrefFor } from '../lib/hashRoute';
import { Button, ButtonRow, Container, LinkList, LinkRow, PageIntro, Section } from '../components/ui';

const host = (url: string) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');

/** Contact, live work and profiles. Links without a URL yet (see src/data/profile.ts) stay hidden. */
export const LinksView: React.FC = () => {
  const online = links.filter((l) => l.url && l.id !== 'email');
  // Every project link marked live in projects.ts, in project order
  const live = projects.flatMap((p) => (p.links ?? []).filter((l) => l.live).map((l) => ({ project: p, link: l })));

  return (
    <Container>
      <PageIntro
        eyebrow="07 · Contact"
        title="Get in touch"
        lead="Email is the fastest way to reach me. I read everything, and I reply to anything about operations, software or the Philippines."
      >
        <ButtonRow className="mt-[26px] items-center">
          <Button href={`mailto:${profile.email}`}>Email me</Button>
          <span className="text-[16px] text-[#d6d6d6] select-all [overflow-wrap:anywhere]">{profile.email}</span>
        </ButtonRow>
      </PageIntro>

      {live.length > 0 && (
        <Section title="See my work live">
          <LinkList>
            {live.map(({ project, link }) => (
              <LinkRow
                key={link.url}
                label={project.title}
                detail={`${link.label} · ${host(link.url)}`}
                href={link.url}
                external
              />
            ))}
          </LinkList>
          <p className="mt-[14px] mb-0 text-[15px] text-[var(--muted)]">
            The rest are internal tools or run on my own machine.{' '}
            <a href={hrefFor('projects')} className="text-[var(--accent)] underline underline-offset-[4px]">
              Read about every project
            </a>
            .
          </p>
        </Section>
      )}

      <Section title="Elsewhere online">
        <LinkList>
          {online.map((l) => (
            <LinkRow key={l.id} label={l.label} detail={l.note ? `${l.note} · ${l.handle}` : l.handle} href={l.url} external />
          ))}
        </LinkList>
      </Section>
    </Container>
  );
};
