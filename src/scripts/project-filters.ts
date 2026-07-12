/* Category filter for /projects — pure DOM, no framework.
 * External .ts file for the same dev-time rolldown-vite reason as
 * knowledge-graph.ts (virtual astro scripts 500 in dev). */

const buttons = document.querySelectorAll<HTMLButtonElement>('[data-filter]');
const cards = document.querySelectorAll<HTMLElement>('[data-project]');
const ACTIVE = ['border-primary', 'bg-accent', 'text-primary'];
const IDLE = ['border-border', 'bg-transparent', 'text-muted-foreground'];

buttons.forEach((btn) => {
  btn.addEventListener('click', () => {
    buttons.forEach((b) => {
      const on = b === btn;
      b.classList.remove(...(on ? IDLE : ACTIVE));
      b.classList.add(...(on ? ACTIVE : IDLE));
      b.setAttribute('aria-pressed', String(on));
    });
    const key = btn.dataset.filter!;
    cards.forEach((card) => {
      const show = key === 'all' || (card.dataset.cats ?? '').split(' ').includes(key);
      card.style.display = show ? '' : 'none';
    });
  });
});
