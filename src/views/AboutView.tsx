import React from 'react';
import { profile } from '../data/profile';
import { hrefFor } from '../lib/hashRoute';
import { Arrow, Block, Prose } from '../components/ui';

export const AboutView: React.FC = () => (
  <>
    <Block title="info">
      <Prose>
        <p>
          {profile.name}. Supply chain student at BYU–Hawaii, from the {profile.origin}, based in{' '}
          {profile.location}. I build the software a 90-person culinary department runs on.
        </p>
        <p className="text-[var(--muted)]">{profile.availability}.</p>
      </Prose>
    </Block>

    <Block title="about">
      <Prose>
        <p>
          I came to software through operations problems. At the Polynesian Cultural Center’s culinary
          department there was a Monday labor report that took a morning to assemble by hand, so I automated
          it. Then the schedule, then the scorecard, then the forms. Two years later the department runs on a
          25-module platform I built and maintain, and my title is AI, Software &amp; Systems Specialist.
        </p>
        <p>
          I study Supply Chain Management with a minor in Information Technology (GPA 3.9, graduating December
          2027). The degree is the point. I want to understand the warehouse delivery schedule and the payroll
          report well enough to fix both, not just write the code.
        </p>
        <p>
          On the side I run NathanWORKS, a small web and automation studio, and I build things to learn: a
          voice assistant that runs entirely on my own desk, a prompt-to-3D furniture generator, satellite
          imagery pipelines over Philippine coastlines, motion graphics written as code.
        </p>
        <p>
          Before university I spent two years as a volunteer missionary in Vanuatu and Quezon City, running
          inventory and delivery routes for about 100 people and leading around 120 training workshops. I
          learned Bislama there. It is my fifth language.
        </p>
      </Prose>
    </Block>

    <Block title="now">
      <Prose>
        <ul>
          <li>Shipping the next Culinary Command Center modules at PCC.</li>
          <li>
            Applying for Spring/Summer 2027 internships in supply chain analytics, operations technology and
            applied AI.
          </li>
          <li>Client work through NathanWORKS.</li>
        </ul>
      </Prose>
    </Block>

    <Block title="looking for">
      <Prose>
        <p>
          A Spring/Summer 2027 internship where the software and the operation are the same problem.
          Asia-Pacific, the US, or remote.
        </p>
      </Prose>
      <div className="mt-[1em] flex flex-col">
        <Arrow label="Mail" value={profile.email} href={`mailto:${profile.email}`} />
        <Arrow label="Resume" value="PDF and full text" href={hrefFor('resume')} />
        <Arrow label="Work" value="projects and case studies" href={hrefFor('projects')} />
      </div>
    </Block>
  </>
);
