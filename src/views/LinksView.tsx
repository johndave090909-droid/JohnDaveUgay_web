import React from 'react';
import { links, profile } from '../data/profile';
import { Arrow, Block, Prose, Title } from '../components/ui';

export const LinksView: React.FC = () => {
  const live = links.filter((l) => l.url);
  const pending = links.filter((l) => !l.url);

  return (
    <>
      <Title kicker="Where else to find me">Around the web</Title>

      <Block title="connect">
        <div className="flex flex-col">
          {live.map((l) => (
            <Arrow key={l.id} label={l.label} value={l.handle} href={l.url} external={!l.url.startsWith('mailto:')} />
          ))}
        </div>
      </Block>

      <Block title="notes">
        <Prose>
          <ul>
            {live.map((l) => (
              <li key={l.id}>
                <strong>{l.label}.</strong> {l.note}
              </li>
            ))}
          </ul>
        </Prose>
      </Block>

      {pending.length > 0 && (
        <Block title="coming">
          <div className="flex flex-col">
            {pending.map((l) => (
              <Arrow key={l.id} label={l.label} value={l.handle} />
            ))}
          </div>
        </Block>
      )}

      <Block title="say hello">
        <Prose>
          <p>
            Email is the fastest. I read everything, and I reply to anything that is about operations,
            software, or the Philippines.
          </p>
        </Prose>
        <div className="mt-[1em]">
          <Arrow label="Mail" value={profile.email} href={`mailto:${profile.email}`} />
        </div>
      </Block>
    </>
  );
};
