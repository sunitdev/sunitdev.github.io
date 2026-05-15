import { sideProjects } from '@/content/experience';

export function ProjectsGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {sideProjects.map((project) => (
        <a
          key={project.name}
          href={project.href}
          target="_blank"
          rel="noreferrer"
          className="group rounded-lg border border-[color:var(--color-border)] bg-bg-elev p-4 transition-colors hover:border-accent"
        >
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-mono-tabular text-[14px] font-medium text-fg transition-colors group-hover:text-accent">
              {project.name}
            </h3>
            <span className="font-mono-tabular text-[11px] text-muted transition-colors group-hover:text-accent">
              github ↗
            </span>
          </div>
          <p className="mt-2 text-[13px] leading-relaxed text-fg-muted">
            {project.description}
          </p>
        </a>
      ))}
    </div>
  );
}
