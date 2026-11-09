import React from 'react';
import { scrollToId } from '../lib/hashRoute';

/** "Opens elsewhere" arrow. The variation selector keeps Windows from drawing it as a coloured emoji. */
export const EXT = '↗︎';

/** Small monospace label above a heading, in the accent colour. */
export const Eyebrow: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <p className={`m-0 font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--accent)] ${className}`}>{children}</p>
);

/** Reading column. Wide pages (the project grid) pass `wide`. */
export const Container: React.FC<{ children: React.ReactNode; wide?: boolean; className?: string }> = ({
  children,
  wide,
  className = '',
}) => (
  <div className={`mx-auto w-full px-5 sm:px-8 ${wide ? 'max-w-[1120px]' : 'max-w-[760px]'} ${className}`}>
    {children}
  </div>
);

/** The top of every page: what the page is, in one heading and one sentence. */
export const PageIntro: React.FC<{
  eyebrow?: string;
  title: React.ReactNode;
  lead?: React.ReactNode;
  children?: React.ReactNode;
}> = ({ eyebrow, title, lead, children }) => (
  <header className="pt-[48px] sm:pt-[72px] pb-[8px]">
    {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
    <h1 className="mt-[12px] mb-0 text-[34px] sm:text-[44px] leading-[1.12] font-semibold text-white tracking-[-0.01em]">
      {title}
    </h1>
    {lead && <p className="mt-[16px] mb-0 text-[18px] sm:text-[20px] leading-[1.6] text-[#d6d6d6]">{lead}</p>}
    {children}
  </header>
);

/** A titled part of a page. */
export const Section: React.FC<{ title: string; id?: string; children: React.ReactNode; className?: string }> = ({
  title,
  id,
  children,
  className = '',
}) => (
  <section id={id} className={`anchor mt-[56px] ${className}`}>
    <h2 className="mt-0 mb-[18px] text-[24px] sm:text-[26px] leading-[1.25] font-semibold text-white">{title}</h2>
    {children}
  </section>
);

/** Long-form copy. */
export const Reading: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`reading ${className}`}>{children}</div>
);

/** Tags such as a project's stack. */
export const Chips: React.FC<{ items: string[] }> = ({ items }) => (
  <ul className="m-0 p-0 list-none flex flex-wrap gap-[8px]">
    {items.map((i) => (
      <li
        key={i}
        className="px-[12px] py-[6px] rounded-full bg-[var(--chip)] border border-[var(--line)] text-[14px] leading-[1.3] text-[#d9d9d9]"
      >
        {i}
      </li>
    ))}
  </ul>
);

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  external?: boolean;
};

/** A clear call to action. Primary is filled lavender; secondary is an outline. */
export const Button: React.FC<ButtonProps> = ({ href, children, variant = 'primary', external }) => (
  <a
    href={href}
    target={external ? '_blank' : undefined}
    rel={external ? 'noreferrer' : undefined}
    className={`inline-flex items-center justify-center gap-[8px] min-h-[46px] px-[20px] rounded-full text-[15.5px] font-medium no-underline transition-colors duration-150 ${
      variant === 'primary'
        ? 'bg-[var(--accent)] text-black hover:bg-[var(--accent-soft)]'
        : 'border border-[#4a4a4a] text-white hover:border-white'
    }`}
  >
    {children}
  </a>
);

export const ButtonRow: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`flex flex-wrap gap-[12px] ${className}`}>{children}</div>
);

/** A row in a list of links: name on the left, detail under it, arrow on the right. Without an href it is plain text. */
export const LinkRow: React.FC<{
  label: string;
  detail?: string;
  href?: string;
  external?: boolean;
}> = ({ label, detail, href, external }) => {
  const body = (
    <>
      <span className="min-w-0">
        <span className="block text-[17px] font-medium text-white">{label}</span>
        {detail && <span className="block mt-[2px] text-[15px] text-[var(--muted)] [overflow-wrap:anywhere]">{detail}</span>}
      </span>
      {href && (
        <span aria-hidden="true" className="shrink-0 text-[20px] text-[var(--accent)] transition-transform group-hover:translate-x-[3px]">
          {external ? EXT : '→'}
        </span>
      )}
    </>
  );
  const cls = 'group flex items-center justify-between gap-[16px] py-[16px] border-b border-[var(--line)] no-underline';
  return (
    <li className="list-none">
      {href ? (
        <a href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined} className={cls}>
          {body}
        </a>
      ) : (
        <div className={cls}>{body}</div>
      )}
    </li>
  );
};

export const LinkList: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <ul className={`m-0 p-0 border-t border-[var(--line)] ${className}`}>{children}</ul>
);

/** "On this page": jumps to the sections of a long page. */
export const OnThisPage: React.FC<{ items: { id: string; label: string }[] }> = ({ items }) => (
  <nav aria-label="On this page" className="mt-[28px]">
    <p className="m-0 mb-[10px] font-mono text-[12px] uppercase tracking-[0.12em] text-[var(--muted)]">On this page</p>
    <ul className="m-0 p-0 list-none flex flex-wrap gap-[8px]">
      {items.map((i) => (
        <li key={i.id}>
          <button
            type="button"
            onClick={() => scrollToId(i.id)}
            className="px-[14px] py-[8px] rounded-full border border-[#3a3a3a] text-[14.5px] text-[#e0e0e0] cursor-pointer hover:border-white hover:text-white transition-colors"
          >
            {i.label}
          </button>
        </li>
      ))}
    </ul>
  </nav>
);

/** A back link at the top of a detail page. */
export const BackLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a
    href={href}
    className="group inline-flex items-center gap-[8px] mt-[32px] sm:mt-[44px] text-[15px] text-[var(--muted)] no-underline hover:text-white"
  >
    <span aria-hidden="true" className="transition-transform group-hover:-translate-x-[3px]">
      ←
    </span>
    {children}
  </a>
);

/** Previous / next pair at the bottom of a detail page. */
export const PrevNext: React.FC<{
  prev?: { href: string; label: string };
  next?: { href: string; label: string };
  noun: string;
}> = ({ prev, next, noun }) => {
  if (!prev && !next) return null;
  const card = 'group block rounded-[14px] border border-[var(--line)] bg-[var(--card)] p-[18px] no-underline hover:border-[#4a4a4a] transition-colors';
  return (
    <nav aria-label={`Previous and next ${noun}`} className="mt-[64px] grid gap-[12px] sm:grid-cols-2">
      {prev ? (
        <a href={prev.href} className={card}>
          <span className="block text-[14px] text-[var(--muted)]">← Previous {noun}</span>
          <span className="block mt-[4px] text-[17px] font-medium text-white">{prev.label}</span>
        </a>
      ) : (
        <span className="hidden sm:block" />
      )}
      {next && (
        <a href={next.href} className={`${card} sm:text-right`}>
          <span className="block text-[14px] text-[var(--muted)]">Next {noun} →</span>
          <span className="block mt-[4px] text-[17px] font-medium text-white">{next.label}</span>
        </a>
      )}
    </nav>
  );
};

/** Bordered box for a short note. */
export const Note: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`rounded-[14px] border border-[var(--line)] bg-[var(--card)] p-[20px] sm:p-[24px] ${className}`}>{children}</div>
);
