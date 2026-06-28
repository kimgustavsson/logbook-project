# Dev blog (Astro + Supabase + Giscus)

A minimal personal blog: a dev log and a writing section, with per-post view
counts and comments. Static-built, deployable to Vercel.

See **SETUP.md** for first-run and deployment steps.

## Project structure

```
src/
  content/posts/        Your posts as Markdown (devlog/ and writing/)
  content.config.ts     Post schema (frontmatter validation)
  pages/                Routes: home + dynamic post pages
  layouts/              BaseLayout (shell) + PostLayout (article)
  components/           Reusable UI: Nav, Footer, Hero, PostList, PostRow,
                        ViewCounter, Comments
  lib/                  Data layer: supabase client + view-count logic
  styles/               tokens.css (variables) + global.css
  scripts/              reveal, scroll-rail, photo-trail (one concern each)
```

## Everyday tasks

- **Write a post**: add a `.md` file under `src/content/posts/devlog/` or
  `.../writing/`. Fill in the frontmatter (title, description, date, tags).
- **Run locally**: `npm install` then `npm run dev`.
- **Build**: `npm run build` (output in `dist/`).
