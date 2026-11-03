import React from 'react';

/** Bracketed section heading in the accent colour: [about], [projects]... */
export const H: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-[13px] text-[var(--accent)] mb-[1em] font-normal tracking-[0.02em] uppercase">
    [{children}]
  </h2>
);

/** A heading plus its content, with an optional anchor id the index list can scroll to. */
export const Block: React.FC<{ title: string; id?: string; children: React.ReactNode }> = ({
  title,
  id,
  children,
}) => (
  <section id={id} className="mb-[2.2em] scroll-mt-[8px] last:mb-0">
    <H>{title}</H>
    {children}
  </section>
);

/** Normal-case body copy. Everything else on the page is uppercase. */
export const Prose: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = '',
}) => <div className={`prose text-[var(--text)] ${className}`}>{children}</div>;

/** Two-column meta row: white on the left, muted on the right. */
export const Meta: React.FC<{
  left: React.ReactNode;
  right?: React.ReactNode;
  leftClass?: string;
}> = ({ left, right, leftClass = 'text-white' }) => (
  <div className="flex justify-between gap-[16px] text-[12px] leading-[1.35]">
    <div className={`${leftClass} whitespace-pre-line text-left`}>{left}</div>
    {right !== undefined && (
      <div className="text-[var(--muted)] whitespace-pre-line text-right shrink-0 max-w-[55%]">
        {right}
      </div>
    )}
  </div>
);

export const chipClass = (active: boolean, clickable = true) =>
  `inline-block px-[9px] py-[5px] text-[11px] uppercase leading-[1.2] whitespace-nowrap transition-colors duration-150 ${
    active ? 'bg-[#e6e6e6] text-[#000000] font-medium' : 'bg-[var(--chip)] text-[#cfcfcf]'
  } ${clickable && !active ? 'hover:text-white hover:bg-[#252525]' : ''}`;

/** Static chips, used for stacks. */
export const Chips: React.FC<{ items: string[] }> = ({ items }) => (
  <div className="flex flex-wrap gap-[6px]">
    {items.map((i) => (
      <span key={i} className={chipClass(false, false)}>
        {i}
      </span>
    ))}
  </div>
);

/** "Label -> value" line, the site's link convention. Without an href it renders muted, as a placeholder. */
export const Arrow: React.FC<{ label: string; value: string; href?: string; external?: boolean }> = ({
  label,
  value,
  href,
  external,
}) =>
  href ? (
    <a
      href={href}
      target={external ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      className="block underline my-[4px] text-[var(--text)] [overflow-wrap:anywhere]"
    >
      {label} -&gt; {value}
    </a>
  ) : (
    <span className="block my-[4px] text-[var(--muted)] [overflow-wrap:anywhere]">
      {label} -&gt; {value}
    </span>
  );

/** Opens one part of the home page: its number, its name, and an optional note on the right. */
export const SectionHead: React.FC<{ num: string; label: string; note?: string }> = ({ num, label, note }) => (
  <header className="mb-[2em] pt-[12px] border-t border-[var(--line)]">
    <div className="flex justify-between gap-[16px] text-[11px] text-[var(--muted)]">
      <span>{num}</span>
      {note && <span className="text-right">{note}</span>}
    </div>
    <h1 className="mt-[10px] text-[22px] leading-[1.15] text-white font-medium tracking-[0.01em] m-0">{label}</h1>
  </header>
);

/** Title block at the top of a detail view. */
export const Title: React.FC<{ kicker?: string; children: React.ReactNode; meta?: React.ReactNode }> = ({
  kicker,
  children,
  meta,
}) => (
  <header className="mb-[1.8em]">
    {kicker && <div className="text-[11px] text-[var(--muted)] mb-[6px]">{kicker}</div>}
    <h1 className="text-[16px] leading-[1.3] text-white font-medium tracking-[0.02em] m-0">{children}</h1>
    {meta && <div className="mt-[8px] text-[11px] text-[var(--muted)]">{meta}</div>}
  </header>
);
