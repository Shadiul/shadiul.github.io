import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    // The deck — one-paragraph standfirst under the title.
    description: z.string(),
    date: z.coerce.date(),
    tag: z.string(), // single display tag, e.g. "systems"
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
