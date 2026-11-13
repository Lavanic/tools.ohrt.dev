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
      /** something the project won, shown as a badge beside its title */
      award: z.string().optional(),
      /** for a project in a private repo, which the build cannot ask GitHub about: its numbers and newest commit, written in by hand */
      snapshot: z
        .object({
          stars: z.number().default(0),
          commits: z.number(),
          last: z.object({ message: z.string(), date: z.coerce.date(), sha: z.string() }),
        })
        .optional(),
      monitor: z.string().optional(),
      wip: z.boolean().default(false),
      archived: z.coerce.date().optional(),
      /**
       * src opens in the viewer over its caption. An animation also names a poster, the still that stands for it,
       * and may name a preview, a small loop to play as its thumbnail.
       */
      images: z
        .array(
          z.object({
            src: image(),
            poster: image().optional(),
            preview: image().optional(),
            caption: z.string().optional(),
          }),
        )
        .optional(),
    }),
});

export const collections = { projects };
