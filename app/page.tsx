import { Nav } from '@/components/nav';
import { Hero } from '@/components/hero';
import { Footer } from '@/components/footer';
import { Section } from '@/components/ui/section';
import { BloomFilterExplorable } from '@/components/explorables/bloom-filter';
import { CrdtExplorable } from '@/components/explorables/crdt-or-set';
import { ThompsonSamplingExplorable } from '@/components/explorables/thompson-sampling';
import { HnswExplorable } from '@/components/explorables/hnsw';
import { ExperienceTimeline } from '@/components/experience-timeline';
import { SkillsGrid } from '@/components/skills-grid';
import { ProjectsGrid } from '@/components/projects-grid';
import { EducationBlock } from '@/components/education-block';
import { ContactBlock } from '@/components/contact-block';

export default function Home() {
  return (
    <>
      <Nav />
      <Hero />

      <div className="container-prose space-y-28 pb-20 sm:space-y-32">
        <BloomFilterExplorable />
        <CrdtExplorable />
        <ThompsonSamplingExplorable />
        <HnswExplorable />
      </div>

      <Section
        id="experience"
        eyebrow="experience"
        title="8+ years across Reddit, Workday, and Amazon"
      >
        <ExperienceTimeline />
      </Section>

      <Section id="skills" eyebrow="skills" title="What I work with">
        <SkillsGrid />
      </Section>

      <Section id="projects" eyebrow="side projects" title="Things built on the side">
        <ProjectsGrid />
      </Section>

      <Section id="education" eyebrow="education" title="Where I studied">
        <EducationBlock />
      </Section>

      <Section id="about" eyebrow="about">
        <div className="space-y-4 text-[17px] leading-[1.65] text-fg">
          <p>
            I'm a Senior Software Engineer at Reddit. Most recently I built an
            LLM-powered content classification platform that automated how
            millions of communities are categorized and rated — unlocking
            previously untapped content for recommendations.
          </p>
          <p>
            Before that, at Workday, I built a cloud-agnostic observability
            platform on Grafana Mimir processing 1TB+ of metrics per day. At
            Amazon, I worked on risk management systems for the European
            transportation network.
          </p>
          <p>
            I like solving complex real-world problems with direct user impact.
            Based in Ireland, originally from Mumbai. MSc in Data Science from
            Trinity College Dublin.
          </p>
        </div>
      </Section>

      <section id="contact" className="container-prose py-12">
        <ContactBlock />
      </section>

      <Footer />
    </>
  );
}
