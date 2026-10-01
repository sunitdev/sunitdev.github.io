# Sunit — Learning & curious experiments

A personal journal with a static, notebook-based blog. The homepage focuses on ideas and experiments; employment history, education details, contact details, social profiles, and résumé links have been removed.

## Development

Run `bun install`, then `bun run dev`. Validate with `bun run typecheck` and `bun run build`. The static export is written to `docs/` for GitHub Pages. Development uses `.next-dev/` so preview sessions cannot overwrite the exported pages.

## Publishing notebook posts

The executed notebooks in `public/notebooks/` are the source of truth for article prose, Python code, saved results, and figures. The website reads them during the build; it does not execute Python or need another repository.

1. Create or edit a Python notebook in Jupyter. Use Markdown paragraphs and `##` headings, Python cells, and text, PNG, or SVG outputs. The lightweight renderer does not support full Markdown, LaTeX typesetting, widgets, or interactive outputs.
2. Run all cells and save the notebook under `public/notebooks/`.
3. Add the slug, title, description, topic, label, notebook filename, and featured flag to `content/posts.ts`. Set `featured: true` on one post to choose the homepage feature.
4. Optional `previewImage` metadata supplies descriptive alt text and a caption. The homepage and index use the first saved SVG or PNG output directly from the notebook; no separate image file is needed.
5. Build the website. The article displays the notebook's saved cells and results, and readers can download the original `.ipynb` to run it in Jupyter.

The single example essay estimates π with random points. Editing and saving its notebook updates the article and its figures on the next build.

## Editorial design

The website implements the Editorial Journal concept with ivory and cobalt, abstract SVG artwork, fine rules, and light/dark themes. Fonts are self-hosted through `next/font/local`; their licenses and source information are in `assets/fonts/`. Font assets have been compressed to WOFF2 and subsetted for Latin, Greek, punctuation, and mathematical symbols.
