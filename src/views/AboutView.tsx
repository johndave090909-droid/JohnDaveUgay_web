import React from 'react';
import { profile } from '../data/profile';
import { hrefFor } from '../lib/hashRoute';
import { Button, ButtonRow, Container, PageIntro, Reading, Section } from '../components/ui';

const facts: { label: string; value: string }[] = [
  { label: 'Based in', value: `${profile.location} · ${profile.timezone}` },
  { label: 'From', value: profile.origin },
  { label: 'Studying', value: 'B.S. Supply Chain Management, IT minor · BYU–Hawaii · graduating Dec 2027 · GPA 3.9' },
  { label: 'Working', value: 'Head of Operations Intelligence · Polynesian Cultural Center, Culinary' },
  { label: 'Studio', value: 'NathanWORKS, a small web and automation studio' },
  { label: 'Languages', value: profile.languages },
  { label: 'Status', value: profile.availability },
];

export const AboutView: React.FC = () => (
  <Container>
    <PageIntro
      eyebrow="01 · About"
      title="About me"
      lead={
        <>
          I’m {profile.name}, a supply chain student at BYU–Hawaii, from the {profile.origin}. I build the software a
          90-person culinary department runs on.
        </>
      }
    />

    <Section title="At a glance">
      <dl className="m-0 border-t border-[var(--line)]">
        {facts.map((f) => (
          <div
            key={f.label}
            className="grid gap-[2px] sm:grid-cols-[150px_1fr] sm:gap-[24px] py-[14px] border-b border-[var(--line)]"
          >
            <dt className="font-mono text-[12.5px] uppercase tracking-[0.08em] text-[var(--muted)] sm:pt-[3px]">{f.label}</dt>
            <dd className="m-0 text-[17px] leading-[1.55] text-white">{f.value}</dd>
          </div>
        ))}
      </dl>
    </Section>

    <Section title="My story">
      <Reading>
        <p>
          I came to software through operations problems. At the Polynesian Cultural Center’s culinary department there
          was a Monday labor report that took a morning to assemble by hand, so I automated it. Then the schedule, then
          the scorecard, then the forms. Two years later the department runs on a 25-module platform I built and
          maintain, and I am the department’s Head of Operations Intelligence.
        </p>
        <p>
          I study Supply Chain Management with a minor in Information Technology (GPA 3.9, graduating December 2027).
          The degree is the point. I want to understand the warehouse delivery schedule and the payroll report well
          enough to fix both, not just write the code.
        </p>
        <p>
          On the side I run NathanWORKS, a small web and automation studio, and I build things to learn: a voice
          assistant that runs entirely on my own desk, a prompt-to-3D furniture generator, satellite imagery pipelines
          over Philippine coastlines, motion graphics written as code.
        </p>
        <p>
          Before university I spent two years as a volunteer missionary in Vanuatu and Quezon City, running inventory and
          delivery routes for about 100 people and leading around 120 training workshops. I learned Bislama there. It is
          my fifth language.
        </p>
      </Reading>
    </Section>

    <Section title="What I’m doing now">
      <Reading>
        <ul>
          <li>Shipping the next Culinary Command Center modules at PCC.</li>
          <li>Applying for Spring/Summer 2027 internships in supply chain analytics, operations technology and applied AI.</li>
          <li>Client work through NathanWORKS.</li>
        </ul>
      </Reading>
    </Section>

    <Section title="What I’m looking for">
      <Reading>
        <p>
          A Spring/Summer 2027 internship where the software and the operation are the same problem. Asia-Pacific, the
          US, or remote.
        </p>
      </Reading>
      <ButtonRow className="mt-[24px]">
        <Button href={`mailto:${profile.email}`}>Email me</Button>
        <Button href={hrefFor('projects')} variant="secondary">
          See my projects
        </Button>
        <Button href={hrefFor('resume')} variant="secondary">
          Read my resume
        </Button>
      </ButtonRow>
    </Section>
  </Container>
);
