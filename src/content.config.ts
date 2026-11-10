import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      started: z.coerce.date(),
      language: z.string(),
      status: z.enum(['live', 'maintained', 'finished', 'hackathon', 'wip']),
      repo: z.string().url().optional(),
      writeup: z.string().url().optional(),
      monitor: z.string().optional(),
      minor: z.boolean().default(false),
      archived: z.coerce.date().optional(),
      images: z.array(image()).optional(),
    }),
});

export const collections = { projects };
