import { site } from '@/lib/site';

export function Hero() {
  return (
    <section id="main" className="container-prose pt-10 pb-20 sm:pt-16 sm:pb-24">
      <div className="font-mono-tabular text-[11px] uppercase tracking-widest text-muted">
        portfolio · v3
      </div>
      <h1 className="mt-3 text-4xl font-semibold leading-[1.04] tracking-tight text-fg sm:text-6xl">
        {site.name}
      </h1>
      <p className="mt-3 font-mono-tabular text-sm uppercase tracking-wider text-fg-muted sm:text-base">
        {site.role} · {site.title}
      </p>
      <div className="mt-7 max-w-[64ch] space-y-4 text-[17px] leading-[1.65] text-fg">
        <p>
          Hi, I'm Sunit — a software engineer with 8+ years across Reddit,
          Workday, and Amazon.
        </p>
        <p>
          Most recently at Reddit, I built an LLM-powered content classification
          platform that automated how millions of communities are categorized
          and rated — unlocking previously untapped content for recommendations
          and driving measurable gains in user traffic. Before that at Workday,
          I built a cloud-agnostic observability platform processing 1TB+ of
          metrics per day. At Amazon, I worked on risk management systems for
          the European transportation network.
        </p>
        <p className="text-fg-muted">
          Below are four technical concepts that quietly power the systems I've
          worked on — from Mimir's block index to Reddit's ranking experiments
          to Zaya's offline sync. Drag the sliders, watch them work.
        </p>
      </div>
    </section>
  );
}
