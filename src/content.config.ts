import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    language: z.string(),
    status: z.enum(['live', 'maintained', 'finished', 'hackathon', 'wip']),
    team: z.string().optional(),
    repo: z.string().url().optional(),
    writeup: z.string().url().optional(),
    run: z.string().optional(),
    monitor: z.string().optional(),
    minor: z.boolean().default(false),
  }),
});

export const collections = { projects };
