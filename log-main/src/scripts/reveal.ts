// Entrance + scroll-reveal animations.
// - Splits the hero label into characters for a staggered drop.
// - Draws a sweeping line ahead of the hero roles, then cascades their letters in.
// - Cascades the hero headline's letters in.
// - Reveals hero body lines and captions on load.
// - Reveals .fade-up elements as they scroll into view.
// Respects prefers-reduced-motion (the CSS already disables transforms there).

// Wraps each non-whitespace character of `root` in its own `.letter` span
// (whitespace stays as plain text so words still wrap normally), and stamps
// a transition-delay on each so a single class toggle cascades them in.
function splitLetters(root: HTMLElement, stepMs: number, baseDelayMs = 0): number {
  let i = 0;
  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? '';
      if (!text) return;
      const frag = document.createDocumentFragment();
      for (const ch of text) {
        if (/\s/.test(ch)) {
          frag.appendChild(document.createTextNode(ch));
        } else {
          const span = document.createElement('span');
          span.className = 'letter';
          span.textContent = ch;
          span.style.transitionDelay = `${baseDelayMs + i * stepMs}ms`;
          frag.appendChild(span);
          i++;
        }
      }
      node.replaceWith(frag);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      Array.from(node.childNodes).forEach(walk);
    }
  };
  Array.from(root.childNodes).forEach(walk);
  return i;
}

export function initReveal(): void {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Soft light that follows the cursor across the hero.
  const hero = document.querySelector<HTMLElement>('.hero');
  const spotlight = document.querySelector<HTMLElement>('.h-spotlight');
  if (hero && spotlight && !reduce) {
    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      spotlight.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
      spotlight.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
      spotlight.classList.add('active');
    });
    hero.addEventListener('mouseleave', () => spotlight.classList.remove('active'));
  }

  // Split the hero label ("Mission") into per-character spans so each letter
  // can drop in with its own delay.
  const label = document.getElementById('hlabel');
  if (label) {
    const text = label.textContent?.trim() ?? '';
    label.textContent = '';
    [...text].forEach((c, i) => {
      const span = document.createElement('span');
      span.className = 'ch';
      span.textContent = c;
      span.style.transition = 'transform .8s cubic-bezier(.16,1,.3,1), opacity .6s ease';
      span.style.transitionDelay = `${0.12 + i * 0.05}s`;
      label.appendChild(span);
    });
  }

  // Fire hero entrance once everything is parsed.
  const runEntrance = () => {
    document.querySelectorAll<HTMLElement>('#hlabel .ch').forEach((ch) => {
      ch.style.transform = 'translateY(0)';
      ch.style.opacity = '1';
    });
    document.querySelectorAll<HTMLElement>('#hbody .bline').forEach((line, i) => {
      setTimeout(() => line.classList.add('in'), 650 + i * 85);
    });
    document.querySelectorAll<HTMLElement>('.hero .fade-up').forEach((el) => {
      const delay = parseInt(el.dataset.delay || '0', 10);
      setTimeout(() => el.classList.add('in'), delay);
    });

    if (!reduce) {
      const growMs = 450; // time for the line to grow in place before it sweeps
      const step = 38; // ms between each letter starting to fade in
      let rolesEndMs = growMs;

      // Roles line: a thin rule grows in place, then sweeps across the role
      // text at the same pace the letters cascade in, so the bar's tip stays
      // roughly over the letter currently fading in instead of outrunning it.
      const rolesText = document.querySelector<HTMLElement>('.h-roles .roles-text');
      const rLine = document.querySelector<HTMLElement>('.h-roles .r-line');
      if (rolesText && rLine) {
        const letterCount = splitLetters(rolesText, step, growMs);
        const sweepWidth = rolesText.getBoundingClientRect().width + 10;
        const sweepMs = Math.max(letterCount * step, 400);
        const lastLetterDoneMs = growMs + Math.max(letterCount - 1, 0) * step + 500;
        rLine.style.setProperty('--sweep-x', `${sweepWidth}px`);
        rLine.style.setProperty('--sweep-duration', `${sweepMs}ms`);
        requestAnimationFrame(() => {
          rLine.classList.add('in-grow');
          rolesText.querySelectorAll<HTMLElement>('.letter').forEach((l) => l.classList.add('in'));
        });
        setTimeout(() => rLine.classList.add('in-sweep'), growMs);
        // Fade the bar out once every letter has fully appeared.
        setTimeout(() => rLine.classList.add('out'), lastLetterDoneMs + 150);
        rolesEndMs = growMs + sweepMs;
      }

      // Headline: letters cascade in once the roles line has settled.
      const headline = document.querySelector<HTMLElement>('.h-head');
      if (headline) {
        splitLetters(headline, 12, rolesEndMs + 150);
        requestAnimationFrame(() => {
          headline.querySelectorAll<HTMLElement>('.letter').forEach((l) => l.classList.add('in'));
        });
      }
    }
  };
  if (document.readyState === 'complete') runEntrance();
  else addEventListener('load', runEntrance);

  // Reveal non-hero .fade-up elements (list rows, section headings) on scroll.
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll('section .fade-up').forEach((el) => observer.observe(el));
}
