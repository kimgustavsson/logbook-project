// Hero-only image trail. As the cursor moves across the hero, photos stamp
// out behind it and fade away — the trendy portfolio effect, scoped to the
// header so it never covers the reading content below.
//
// TO USE YOUR OWN PHOTOS: drop images into /public/photos/ and replace the
// `images` array with their paths, e.g. ['/photos/1.jpg', '/photos/2.jpg'].
// Square-ish images (roughly 4:5) look best. 4–8 of them is ideal.
// The defaults below are inline SVG placeholders so it works before you add any.

const images: string[] = [
  "/photos/photo1.jpg",
  "/photos/photo2.jpg",
  "/photos/photo3.jpg",
  "/photos/photo4.jpg",
  "/photos/photo5.jpg",
  "/photos/photo6.jpg",
  "/photos/photo7.jpg",
  "/photos/photo8.jpg",
  "/photos/photo9.jpg",
  "/photos/photo10.jpg",
];

export function initPhotoTrail(): void {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce) return;

  const hero = document.getElementById("top");
  if (!hero) return;

  // Preload so the first stamps don't flicker.
  images.forEach((src) => {
    const img = new Image();
    img.src = src;
  });

  hero.style.position = "relative"; // positioning context for absolute stamps

  let index = 0;
  let lastTime = 0;
  let lastX = 0;
  let lastY = 0;

  hero.addEventListener(
    "mousemove",
    (e) => {
      const now = performance.now();
      const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
      // Throttle by both time and distance so stamps are evenly spaced.
      if (now - lastTime < 170 || dist < 95) return;
      lastTime = now;
      lastX = e.clientX;
      lastY = e.clientY;

      const rect = hero.getBoundingClientRect();
      const img = document.createElement("img");
      img.src = images[index % images.length];
      index++;
      const rot = (Math.random() * 14 - 7).toFixed(1);
      img.style.cssText = `position:absolute;z-index:2;pointer-events:none;left:${e.clientX - rect.left}px;top:${e.clientY - rect.top}px;width:118px;height:148px;object-fit:cover;border-radius:4px;transform:translate(-50%,-50%) rotate(${rot}deg) scale(.85);opacity:0;transition:transform .7s cubic-bezier(.16,1,.3,1), opacity .7s ease;background-color:transparent !important;filter:drop-shadow(0 8px 15px rgba(20,49,134,.18));`;
      hero.appendChild(img);

      // Animate in on the next frame.
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          img.style.opacity = "1";
          img.style.transform = `translate(-50%,-50%) rotate(${rot}deg) scale(1)`;
        }),
      );
      // Fade out, then remove from the DOM.
      setTimeout(() => {
        img.style.opacity = "0";
        img.style.transform = `translate(-50%,-58%) rotate(${rot}deg) scale(.96)`;
      }, 650);
      setTimeout(() => img.remove(), 1400);
    },
    { passive: true },
  );
}
