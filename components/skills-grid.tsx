import { skills } from '@/content/experience';

export function SkillsGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {skills.map((skill) => (
        <div
          key={skill.category}
          className="rounded-lg border border-[color:var(--color-border)] bg-bg-elev p-4"
        >
          <h3 className="font-mono-tabular text-[11px] uppercase tracking-widest text-accent">
            {skill.category}
          </h3>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {skill.items.map((item) => (
              <li
                key={item}
                className="rounded border border-[color:var(--color-border)] bg-bg px-2 py-0.5 font-mono-tabular text-[12px] text-fg"
              >
                {item}
              </li>
            ))}
          </ul>
          {skill.context && (
            <p className="mt-3 text-[12px] leading-relaxed text-fg-muted">{skill.context}</p>
          )}
        </div>
      ))}
    </div>
  );
}
