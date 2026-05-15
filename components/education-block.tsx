import { education } from '@/content/experience';

export function EducationBlock() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {education.map((entry) => (
        <article
          key={entry.degree}
          className="rounded-lg border border-[color:var(--color-border)] bg-bg-elev p-5"
        >
          <header className="space-y-1">
            <h3 className="font-medium text-fg">{entry.degree}</h3>
            <p className="font-mono-tabular text-[12px] text-fg-muted">
              {entry.institution} · {entry.location}
            </p>
            <p className="font-mono-tabular text-[11px] uppercase tracking-widest text-muted">
              {entry.dateRange}
            </p>
          </header>
          <div className="mt-3 space-y-1">
            <p className="font-mono-tabular text-[11px] uppercase tracking-wider text-muted">
              coursework
            </p>
            <ul className="flex flex-wrap gap-1.5">
              {entry.coursework.map((c) => (
                <li
                  key={c}
                  className="rounded border border-[color:var(--color-border)] bg-bg px-2 py-0.5 font-mono-tabular text-[12px] text-fg"
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </div>
  );
}
