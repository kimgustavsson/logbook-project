// @ts-check
import { defineConfig } from "astro/config";

// Static site output. Works on Vercel, Netlify, or GitHub Pages.
// View counts run client-side against Supabase, so no server runtime is needed here.
// If you later want server-side logic (e.g. abuse protection), switch `output` to
// 'server' and add the Vercel adapter — the rest of the project stays the same.
export default defineConfig({
  site: "https://kimgustavsson.vercel.app/", // TODO: replace with your real URL (used for canonical links / RSS)
  output: "static",
  build: {
    // Emit clean URLs like /devlog/my-post/ instead of /devlog/my-post.html
    format: "directory",
  },
});
