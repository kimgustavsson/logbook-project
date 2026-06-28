// Left-hand scroll-position rail: highlights the section currently in view
// and hides itself near the footer. Expects a .rail with anchor children whose
// data-sec attribute matches a section id on the page.

export function initScrollRail(): void {
  const rail = document.getElementById('rail');
  if (!rail) return;

  const links = [...rail.querySelectorAll<HTMLAnchorElement>('a')];
  const sectionIds = links.map((a) => a.dataset.sec).filter(Boolean) as string[];
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean) as HTMLElement[];

  // Mark the active link as each section scrolls into the middle band.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach((a) => a.classList.toggle('active', a.dataset.sec === id));
        }
      });
    },
    { threshold: 0.4 }
  );
  sections.forEach((s) => observer.observe(s));

  // Hide the rail once the user reaches the bottom (so it doesn't overlap the footer).
  addEventListener(
    'scroll',
    () => {
      const nearBottom = innerHeight + scrollY > document.body.scrollHeight - 120;
      rail.classList.toggle('hide', nearBottom);
    },
    { passive: true }
  );
}
