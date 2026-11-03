import React from 'react';
import { profile } from '../data/profile';
import { resume, RESUME_PDF } from '../data/resume';
import { Arrow, Block, Meta, Prose, Title } from '../components/ui';

export const ResumeView: React.FC = () => (
  <>
    <Title kicker={resume.headline}>{profile.name}</Title>

    <Block title="download" id="resume-download">
      <div className="flex flex-col">
        <Arrow label="PDF" value="Resume_JohnDaveUgay.pdf" href={RESUME_PDF} external />
        <Arrow label="Mail" value={profile.email} href={`mailto:${profile.email}`} />
      </div>
    </Block>

    <Block title="profile" id="resume-profile">
      <Prose>
        <p>{resume.profile}</p>
      </Prose>
    </Block>

    <Block title="experience" id="resume-experience">
      <div className="flex flex-col gap-[1.4em]">
        {resume.experience.map((role) => (
          <div key={role.org + role.dates}>
            <Meta left={role.org} right={role.dates} />
            <div className="text-[11px] text-[var(--muted)] mt-[3px] normal-case">
              {role.title}
              {role.place ? ` · ${role.place}` : ''}
            </div>
            {role.bullets.length > 0 && (
              <Prose className="mt-[8px]">
                <ul>
                  {role.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </Prose>
            )}
          </div>
        ))}
      </div>
    </Block>

    <Block title="education" id="resume-education">
      <Meta left={resume.education.school} right={resume.education.dates} />
      <div className="text-[11px] text-[var(--muted)] mt-[3px] normal-case">
        {resume.education.degree} · {resume.education.gpa}
      </div>
      <Prose className="mt-[8px]">
        <p>Coursework: {resume.education.coursework}</p>
        <p>Certifications: {resume.education.certifications.join(' · ')}.</p>
      </Prose>
    </Block>

    <Block title="projects" id="resume-projects">
      <Prose>
        <ul>
          {resume.projects.map((p, i) => (
            <li key={i}>{p}</li>
          ))}
        </ul>
      </Prose>
    </Block>

    <Block title="skills & languages" id="resume-skills">
      <div className="flex flex-col gap-[10px]">
        {resume.skills.map((s) => (
          <div key={s.group}>
            <div className="text-white text-[12px]">{s.group}</div>
            <div className="normal-case text-[var(--text)] mt-[2px]">{s.items}</div>
          </div>
        ))}
      </div>
    </Block>
  </>
);
