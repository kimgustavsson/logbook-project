// RSS feed at /rss.xml — combines dev log and writing entries, newest first.
// Uses the site URL from astro.config.mjs, so update that `site` value to your
// real domain for the links to be correct.
import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const devlog = await getCollection("devlog", ({ data }) => !data.draft);
  const writing = await getCollection("writing", ({ data }) => !data.draft);

  const items = [
    ...devlog.map((e) => ({ ...e, _base: "devlog", _section: "Dev log" })),
    ...writing.map((e) => ({ ...e, _base: "writing", _section: "Writing" })),
  ]
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
    .map((e) => ({
      title: e.data.title,
      description: e.data.description,
      pubDate: e.data.date,
      link: `/${e._base}/${e.id}/`,
      categories: [e._section, ...(e.data.tags ?? [])],
    }));

  return rss({
    title: "Kim Dasha Gustavsson — dev log & writing",
    description: "Notes on building software — a dev log and longer writing.",
    site: context.site,
    items,
  });
}
