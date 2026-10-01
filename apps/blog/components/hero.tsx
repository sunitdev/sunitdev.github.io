import { JournalArt } from './journal-art';

export function Hero() {
  return (
    <section className="hero journal-container" aria-labelledby="hero-title">
      <div className="hero-copy">
        <p className="eyebrow">A personal journal</p>
        <h1 id="hero-title" className="headline">
          Ideas,
          <br />
          <span className="hero-line">
            made tangible<span className="period">.</span>
          </span>
        </h1>
        <p className="hero-intro">
          Notes on learning, trying things, and the joy of figuring things out.
        </p>
      </div>
      <figure className="hero-art">
        <JournalArt />
        <figcaption className="eyebrow">
          Questions
          <br />
          Discoveries
          <br />
          Work in progress
        </figcaption>
      </figure>
    </section>
  );
}
