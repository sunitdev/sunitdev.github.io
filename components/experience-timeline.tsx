import Link from 'next/link';
import { experience } from '@/content/experience';

export function ExperienceTimeline() {
  return (
    <div className="space-y-10">
      {experience.map((entry) => (
        <article
          key={`${entry.company}-${entry.dateRange}`}
          className="border-l-2 border-[color:var(--color-border)] pl-5 sm:pl-8"
        >
          <header className="mb-3 grid gap-1 sm:grid-cols-[1fr_auto] sm:items-baseline">
            <div>
              <h3 className="text-lg font-semibold text-fg sm:text-xl">
                {entry.company}
                <span className="ml-2 font-mono-tabular text-[11px] uppercase tracking-wider text-muted">
                  · {entry.location}
                </span>
              </h3>
              <p className="text-sm text-fg-muted">{entry.role}</p>
            </div>
            <div className="font-mono-tabular text-[11px] uppercase tracking-widest text-muted sm:text-right">
              {entry.dateRange}
            </div>
          </header>

          <p className="mb-4 text-[14px] leading-relaxed text-fg-muted">{entry.summary}</p>

          <div className="space-y-5">
            {entry.projects.map((project) => (
              <div key={project.title} className="space-y-2">
                <h4 className="font-medium text-fg">
                  {project.href ? (
                    <Link
                      href={project.href}
                      className="transition-colors hover:text-accent"
                    >
                      {project.title}
                      <span className="ml-1 text-accent">↗</span>
                    </Link>
                  ) : (
                    project.title
                  )}
                </h4>
                <ul className="list-outside list-disc space-y-1 pl-5 text-[14px] leading-relaxed text-fg-muted">
                  {project.bullets.map((bullet, i) => (
                    <li key={i}>{bullet}</li>
                  ))}
                </ul>
                {project.metrics && project.metrics.length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {project.metrics.map((m, i) => (
                      <span
                        key={i}
                        className="inline-flex items-baseline gap-1.5 rounded-full border border-[color:var(--color-border)] bg-bg-elev px-2.5 py-1 font-mono-tabular text-[11px]"
                      >
                        <span className="uppercase tracking-wider text-muted">{m.label}</span>
                        <span className="tabular-nums text-fg">{m.value}</span>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </article>
      ))}
    </div>
  );
}
