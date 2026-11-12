import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      icon: z.string(),
      description: z.string(),
      started: z.coerce.date(),
      language: z.string(),
      status: z.enum(['live', 'maintained', 'finished', 'hackathon', 'wip']),
      repo: z.string().url().optional(),
      /** more repos that belong to the same project; their numbers are added to the first one's */
      also: z.array(z.string().url()).optional(),
      writeup: z.string().url().optional(),
      monitor: z.string().optional(),
      wip: z.boolean().default(false),
      archived: z.coerce.date().optional(),
      images: z.array(image()).optional(),
    }),
});

export const collections = { projects };
