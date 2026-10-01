import { site } from '@/lib/site';

export function Footer() {
  return (
    <footer className="journal-container journal-footer">
      <span>
        © {new Date().getFullYear()} {site.name} · A personal journal
      </span>
      <span>Think. Experiment. Understand.</span>
      <span>
        Press <kbd>?</kbd> for shortcuts
      </span>
    </footer>
  );
}
