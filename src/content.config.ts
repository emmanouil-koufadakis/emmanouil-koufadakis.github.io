import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const work = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/work' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    client: z.string(),
    platform: z.enum(['Roku', 'Apple TV', 'PlayStation', 'Windows', 'Web', 'Other']),
    role: z.string(),
    period: z.string(),
    team: z.string().optional(),
    metric: z.object({ value: z.string(), label: z.string() }).optional(),
    summary: z.string(),
    tags: z.array(z.string()).default([]),
    /** Decorative OKLCH hue for the poster artwork. */
    hue: z.number().min(0).max(360),
    order: z.number(),
    /** Optional full-width diagram shown under the case study. */
    diagram: z.enum(['mvvm']).optional(),
  }),
});

export const collections = { work };
