// Cursor spotlight: track the pointer across any [data-spotlight] element and
// expose its local position as --mx/--my for the .spotlight::before glow.
const cards = document.querySelectorAll<HTMLElement>('[data-spotlight]');
for (const el of cards) {
  el.addEventListener('pointermove', (e) => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
}
