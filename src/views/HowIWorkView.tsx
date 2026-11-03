import React from 'react';
import { principles, toolkit } from '../data/howIWork';
import { profile } from '../data/profile';
import { Block, Prose, Title } from '../components/ui';

export const HowIWorkView: React.FC = () => (
  <>
    <Title kicker="Six habits, each one learned the hard way">How I work</Title>

    {principles.map((p) => (
      <Block key={p.id} id={p.id} title={`${p.num} ${p.title}`}>
        <Prose>
          <p>{p.body}</p>
        </Prose>
      </Block>
    ))}

    <Block title="toolkit" id="toolkit">
      <div className="flex flex-col gap-[10px]">
        {toolkit.map((t) => (
          <div key={t.group}>
            <div className="text-white text-[12px]">{t.group}</div>
            <div className="normal-case text-[var(--text)] mt-[2px]">{t.items}</div>
          </div>
        ))}
      </div>
    </Block>

    <Block title="where i am" id="where">
      <Prose>
        <p>
          {profile.location}, {profile.timezone}. Used to working with people in the Philippines, Hawaii and
          the US mainland in the same week, so I keep decisions in writing and ship in small steps that do not
          need a meeting to land.
        </p>
      </Prose>
    </Block>
  </>
);
