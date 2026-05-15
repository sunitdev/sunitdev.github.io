import { site } from '@/lib/site';

const linkClass = 'text-fg transition-colors hover:text-accent';
const Sep = () => <span className="text-muted">·</span>;

export function ContactBlock() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono-tabular text-sm">
      <a href={`mailto:${site.email}`} className={linkClass}>email</a>
      <Sep />
      <a href={`tel:${site.phone}`} className={linkClass}>{site.phoneDisplay}</a>
      <Sep />
      <span className="text-fg-muted">{site.location}</span>
      <Sep />
      <a href={site.github} className={linkClass} target="_blank" rel="noreferrer">github</a>
      <Sep />
      <a href={site.linkedin} className={linkClass} target="_blank" rel="noreferrer">linkedin</a>
      <Sep />
      <a href={site.resume} className={linkClass}>resume</a>
    </div>
  );
}
