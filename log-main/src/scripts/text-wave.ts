// Hero text hover effect. As the cursor passes over the headline or sub
// line, nearby letters rise and dip in a damped ripple — like fingers
// trailing through water — instead of the old whole-hero spotlight/photo
// trail. The ripple is purely a per-letter vertical offset driven by a
// spring, so it composes cleanly with the existing entrance-cascade
// transform/opacity on `.h-head .letter` (different CSS property, `translate`
// vs `transform`, so neither fights the other).
import { splitIntoLetters } from "./letters";

const RADIUS = 130; // px — ripple reach from the cursor
const WAVELENGTH = 46; // px — distance between ripple crests
const AMPLITUDE = 9; // px — peak lift at the cursor's exact position
const STIFFNESS = 0.18;
const DAMPING = 0.78;
const SETTLE_EPSILON = 0.02;

interface Letter {
  el: HTMLElement;
  cx: number;
  cy: number;
  scale: number;
  offset: number;
  velocity: number;
}

export function initTextWave(): void {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  const root = document.querySelector<HTMLElement>(".hero-inner");
  const groups: [HTMLElement | null, number][] = [
    [document.querySelector<HTMLElement>(".h-head"), 1],
    [document.querySelector<HTMLElement>(".h-sub"), 0.55],
  ];
  if (!root) return;

  let letters: Letter[] = [];
  let mouseX = 0;
  let mouseY = 0;
  let active = false;
  let running = false;

  const measure = () => {
    const rootRect = root.getBoundingClientRect();
    letters = groups.flatMap(([el, scale]) => {
      if (!el) return [];
      return splitIntoLetters(el).map((span) => {
        const r = span.getBoundingClientRect();
        return {
          el: span,
          cx: r.left + r.width / 2 - rootRect.left,
          cy: r.top + r.height / 2 - rootRect.top,
          scale,
          offset: 0,
          velocity: 0,
        };
      });
    });
  };

  // The headline's letters are split lazily by reveal.ts's entrance cascade,
  // so remeasure once everything has settled, and again on resize.
  measure();
  addEventListener("load", measure);
  addEventListener("resize", measure);

  const tick = () => {
    let settled = true;
    for (const l of letters) {
      const dist = active ? Math.hypot(l.cx - mouseX, l.cy - mouseY) : Infinity;
      const target =
        dist < RADIUS
          ? AMPLITUDE * l.scale * Math.cos((dist / WAVELENGTH) * Math.PI) * (1 - dist / RADIUS)
          : 0;
      l.velocity += (target - l.offset) * STIFFNESS;
      l.velocity *= DAMPING;
      l.offset += l.velocity;
      l.el.style.translate = `0 ${l.offset.toFixed(2)}px`;
      if (Math.abs(l.velocity) > SETTLE_EPSILON || Math.abs(l.offset) > SETTLE_EPSILON) {
        settled = false;
      }
    }
    if (settled && !active) {
      running = false;
      return;
    }
    requestAnimationFrame(tick);
  };

  const start = () => {
    if (running) return;
    running = true;
    requestAnimationFrame(tick);
  };

  root.addEventListener(
    "mousemove",
    (e) => {
      const rootRect = root.getBoundingClientRect();
      mouseX = e.clientX - rootRect.left;
      mouseY = e.clientY - rootRect.top;
      active = true;
      start();
    },
    { passive: true },
  );
  root.addEventListener("mouseleave", () => {
    active = false;
    start();
  });
}
