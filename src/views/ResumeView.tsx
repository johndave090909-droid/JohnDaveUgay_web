import React from 'react';
import { profile } from '../data/profile';
import { resume, RESUME_PDF } from '../data/resume';
import { Button, ButtonRow, Container, OnThisPage, PageIntro, Reading, Section } from '../components/ui';

const parts = [
  { id: 'resume-profile', label: 'Profile' },
  { id: 'resume-experience', label: 'Experience' },
  { id: 'resume-education', label: 'Education' },
  { id: 'resume-projects', label: 'Projects' },
  { id: 'resume-skills', label: 'Skills & languages' },
];

/** A heading row: name on the left, dates on the right (under it on phones). */
const Entry: React.FC<{ title: string; dates: string; sub?: string; children?: React.ReactNode }> = ({
  title,
  dates,
  sub,
  children,
}) => (
  <div className="py-[22px] border-b border-[var(--line)] first:pt-0">
    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-x-[16px] gap-y-[2px]">
      <h3 className="m-0 text-[19px] leading-[1.35] font-semibold text-white">{title}</h3>
      <span className="shrink-0 text-[15px] text-[var(--muted)]">{dates}</span>
    </div>
    {sub && <p className="mt-[4px] mb-0 text-[16px] text-[#cfcfcf]">{sub}</p>}
    {children}
  </div>
);

export const ResumeView: React.FC = () => (
  <Container>
    <PageIntro eyebrow="05 · Resume" title="Resume" lead={resume.headline}>
      <ButtonRow className="mt-[26px]">
        <Button href={RESUME_PDF} external>
          Download PDF ↓
        </Button>
        <Button href={`mailto:${profile.email}`} variant="secondary">
          Email me
        </Button>
      </ButtonRow>
      <OnThisPage items={parts} />
    </PageIntro>

    <Section title="Profile" id="resume-profile">
      <Reading>
        <p>{resume.profile}</p>
      </Reading>
    </Section>

    <Section title="Experience" id="resume-experience">
      {resume.experience.map((role) => (
        <Entry
          key={role.org + role.dates}
          title={role.org}
          dates={role.dates}
          sub={`${role.title}${role.place ? ` · ${role.place}` : ''}`}
        >
          {role.bullets.length > 0 && (
            <Reading className="mt-[12px]">
              <ul>
                {role.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </Reading>
          )}
        </Entry>
      ))}
    </Section>

    <Section title="Education" id="resume-education">
      <Entry
        title={resume.education.school}
        dates={resume.education.dates}
        sub={`${resume.education.degree} · ${resume.education.gpa}`}
      >
        <Reading className="mt-[12px]">
          <p>
            <strong>Coursework:</strong> {resume.education.coursework}
          </p>
          <p>
            <strong>Certifications:</strong> {resume.education.certifications.join(' · ')}.
          </p>
        </Reading>
      </Entry>
    </Section>

    <Section title="Projects" id="resume-projects">
      <Reading>
        <ul>
          {resume.projects.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </Reading>
    </Section>

    <Section title="Skills & languages" id="resume-skills">
      <dl className="m-0 border-t border-[var(--line)]">
        {resume.skills.map((s) => (
          <div key={s.group} className="py-[14px] border-b border-[var(--line)]">
            <dt className="font-mono text-[12.5px] uppercase tracking-[0.08em] text-[var(--muted)]">{s.group}</dt>
            <dd className="m-0 mt-[4px] text-[17px] leading-[1.6] text-white">{s.items}</dd>
          </div>
        ))}
      </dl>
    </Section>
  </Container>
);
