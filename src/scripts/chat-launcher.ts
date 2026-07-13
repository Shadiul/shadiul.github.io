/**
 * Lazy loader for the Mevrik embeddable chat widget.
 *
 * The widget is ~930KB of third-party JS + an iframe app — loading it eagerly
 * costs ~20 mobile Lighthouse points. So we ship only a lightweight button and
 * inject the real widget script on first click, then open it automatically.
 */
const WIDGET_SRC = 'https://dev-ax-s3.mevrik.com/ax-dev/widget/mevrik-shadiul.js';
const WORKSPACE = 'mevrik-shadiul';

const launcher = document.getElementById('chat-launcher');
let loaded = false;

launcher?.addEventListener('click', () => {
  if (loaded) return;
  loaded = true;
  launcher.setAttribute('aria-busy', 'true');

  const s = document.createElement('script');
  s.src = WIDGET_SRC;
  s.async = true;
  s.setAttribute('data-workspace', WORKSPACE);
  document.body.appendChild(s);

  // When the widget injects its own dock button, open it and retire ours so
  // there's only one control (the widget then owns its open/close UI).
  const obs = new MutationObserver(() => {
    const dock = document.getElementById('mevrik-dock-btn') as HTMLElement | null;
    if (dock) {
      obs.disconnect();
      dock.click();
      launcher.remove();
    }
  });
  obs.observe(document.body, { childList: true, subtree: true });
  // Stop observing after a while if the widget never initialises.
  setTimeout(() => obs.disconnect(), 15000);
});
