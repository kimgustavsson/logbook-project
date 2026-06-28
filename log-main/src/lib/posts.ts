// Shared post-loading helpers. Both the home page and the category index
// pages need the same "drop drafts, sort newest first, map to plain
// objects" logic — defined once here instead of duplicated per page.
import { getCollection } from 'astro:content';

export type PostCategory = 'devlog' | 'writing';

export interface PostSummary {
  slug: string;
  title: string;
  description: string;
  date: Date;
  tags: string[];
  category: PostCategory;
}

export async function getPostsByCategory(category: PostCategory): Promise<PostSummary[]> {
  const entries = await getCollection(category, ({ data }) => !data.draft);
  return entries
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .map((entry) => ({
      slug: entry.id,
      title: entry.data.title,
      description: entry.data.description,
      date: entry.data.date,
      tags: entry.data.tags,
      category,
    }));
}

export async function getAllPosts(): Promise<PostSummary[]> {
  const [devlog, writing] = await Promise.all([
    getPostsByCategory('devlog'),
    getPostsByCategory('writing'),
  ]);
  return [...devlog, ...writing].sort((a, b) => b.date.getTime() - a.date.getTime());
}
