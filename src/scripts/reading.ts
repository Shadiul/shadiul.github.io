// Blog reading controls: font size + family knobs (persisted), and TOC
// scroll-spy that highlights the section you're currently reading.
const prose = document.querySelector<HTMLElement>('.prose-post');

if (prose) {
  const state = {
    size: localStorage.getItem('read-size') ?? 'm',
    font: localStorage.getItem('read-font') ?? 'sans',
  };

  const apply = () => {
    prose.dataset.size = state.size;
    prose.dataset.font = state.font;
    document.querySelectorAll<HTMLButtonElement>('button[data-size]').forEach((b) =>
      b.toggleAttribute('data-on', b.dataset.size === state.size),
    );
    document.querySelectorAll<HTMLButtonElement>('button[data-font]').forEach((b) =>
      b.toggleAttribute('data-on', b.dataset.font === state.font),
    );
  };

  document.querySelectorAll<HTMLButtonElement>('button[data-size]').forEach((b) =>
    b.addEventListener('click', () => {
      state.size = b.dataset.size!;
      localStorage.setItem('read-size', state.size);
      apply();
    }),
  );
  document.querySelectorAll<HTMLButtonElement>('button[data-font]').forEach((b) =>
    b.addEventListener('click', () => {
      state.font = b.dataset.font!;
      localStorage.setItem('read-font', state.font);
      apply();
    }),
  );
  apply();
}

// TOC scroll-spy.
const links = new Map<string, HTMLElement>();
document.querySelectorAll<HTMLElement>('[data-toc-link]').forEach((l) => links.set(l.dataset.tocLink!, l));

if (links.size && 'IntersectionObserver' in window) {
  const heads = [...links.keys()]
    .map((id) => document.getElementById(id))
    .filter((h): h is HTMLElement => !!h);

  let current = '';
  const setActive = (id: string) => {
    if (id === current) return;
    current = id;
    links.forEach((l) => l.removeAttribute('data-active'));
    links.get(id)?.setAttribute('data-active', '');
  };

  const spy = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((e) => e.isIntersecting);
      if (visible.length) {
        // topmost visible heading wins
        visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        setActive((visible[0].target as HTMLElement).id);
      }
    },
    { rootMargin: '-12% 0px -70% 0px', threshold: 0 },
  );
  heads.forEach((h) => spy.observe(h));
}
