// Scroll reveal: add `.in` to `.reveal` elements as they enter the viewport.
// Respects reduced-motion (skips entirely — CSS shows content by default there).
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const els = Array.from(document.querySelectorAll<HTMLElement>('.reveal'));

if (reduce || !('IntersectionObserver' in window)) {
  els.forEach((el) => el.classList.add('in'));
} else {
  const io = new IntersectionObserver(
    (entries, obs) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          (e.target as HTMLElement).classList.add('in');
          obs.unobserve(e.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
  );
  // Stagger siblings that share a parent marked [data-reveal-group].
  for (const group of document.querySelectorAll('[data-reveal-group]')) {
    Array.from(group.querySelectorAll<HTMLElement>('.reveal')).forEach((el, i) => {
      el.style.setProperty('--reveal-delay', `${Math.min(i * 70, 350)}ms`);
    });
  }
  els.forEach((el) => io.observe(el));
}
