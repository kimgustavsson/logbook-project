import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// A single shared schema for every post. Both the dev log and the writing
// section use the same fields, so we define the shape once and reuse it.
// Adding a new field later (e.g. `coverImage`) means editing only this file.
const postSchema = z.object({
  title: z.string(),
  // Short one-line summary shown under the title in list rows.
  description: z.string(),
  // Publish date. Written as YYYY-MM-DD in frontmatter, parsed to a Date here.
  date: z.coerce.date(),
  // Free-form tags rendered as pills. Defaults to empty so it's optional.
  tags: z.array(z.string()).default([]),
  // Set to true to hide a post from production builds (work in progress).
  draft: z.boolean().default(false),
});

// "dev log" entries — short, frequent, technical notes.
const devlog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts/devlog' }),
  schema: postSchema,
});

// "writing" entries — longer essays. Same schema, different folder.
const writing = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts/writing' }),
  schema: postSchema,
});

export const collections = { devlog, writing };
