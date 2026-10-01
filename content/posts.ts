export type Post = {
  slug: string;
  title: string;
  description: string;
  topic: string;
  label: string;
  notebook: string;
  featured: boolean;
  previewImage?: { alt: string; caption: string };
};

export const posts: Post[] = [
  {
    slug: 'estimating-pi',
    title: 'Estimating π with random points',
    description:
      'Turn random points into an estimate of a familiar constant, then explore how sample size changes the result.',
    topic: 'Experiment',
    label: 'Example essay',
    notebook: 'estimating-pi.ipynb',
    featured: true,
    previewImage: {
      alt: 'Blue and orange random points inside and outside a quarter circle',
      caption: 'A familiar constant, found through randomness.',
    },
  },
];

export const featuredPost = posts.find((post) => post.featured) ?? posts[0];
