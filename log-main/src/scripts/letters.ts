// Shared helper: wraps each non-whitespace character of `root` in its own
// `.letter` span (whitespace stays as plain text so words still wrap
// normally). Idempotent — if `root` already contains `.letter` spans from an
// earlier call (by reveal.ts's entrance cascade or text-wave.ts's hover
// effect), returns those instead of double-wrapping.
//
// The letters of one word are also grouped under a single inline-block
// `.word` wrapper. Without it, the line-breaking algorithm sees a row of
// independent inline boxes with nothing gluing them together (the
// whitespace that normally signals "don't break here" got consumed into
// per-letter spans) and is free to wrap between any two letters — so
// "archive" could split into "archi" / "ve" at the edge of the line. A
// hyphen still ends its word early so the natural break-after-hyphen point
// (e.g. "problem-" / "solving") keeps working.
export function splitIntoLetters(root: HTMLElement): HTMLElement[] {
  const existing = root.querySelectorAll<HTMLElement>(".letter");
  if (existing.length) return Array.from(existing);

  const letters: HTMLElement[] = [];
  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const textNode = node as Text;
      const text = textNode.textContent ?? "";
      if (!text) return;
      const frag = document.createDocumentFragment();
      let word: HTMLElement | null = null;
      for (const ch of text) {
        if (/\s/.test(ch)) {
          word = null;
          frag.appendChild(document.createTextNode(ch));
        } else {
          if (!word) {
            word = document.createElement("span");
            word.className = "word";
            word.style.display = "inline-block";
            frag.appendChild(word);
          }
          const span = document.createElement("span");
          span.className = "letter";
          span.textContent = ch;
          letters.push(span);
          word.appendChild(span);
          if (ch === "-") word = null;
        }
      }
      textNode.replaceWith(frag);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      Array.from(node.childNodes).forEach(walk);
    }
  };
  Array.from(root.childNodes).forEach(walk);
  return letters;
}
