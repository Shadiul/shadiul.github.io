/* Project detail modals for /projects — pure DOM, no framework.
 * Every [data-open] card opens its matching <dialog data-modal>. Close via
 * the [data-close] button or a backdrop click; ESC is handled natively by
 * <dialog>. External .ts file for the same dev-time rolldown-vite reason as
 * knowledge-graph.ts (virtual astro scripts 500 in dev). */

function openModal(id: string) {
  const dialog = document.querySelector<HTMLDialogElement>(`dialog[data-modal="${id}"]`);
  dialog?.showModal();
}

const openers = document.querySelectorAll<HTMLElement>('[data-open]');
openers.forEach((el) => {
  const id = el.dataset.open;
  if (!id) return;

  el.addEventListener('click', () => openModal(id));
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal(id);
    }
  });
});

const dialogs = document.querySelectorAll<HTMLDialogElement>('dialog[data-modal]');
dialogs.forEach((dialog) => {
  dialog.querySelectorAll<HTMLElement>('[data-close]').forEach((btn) => {
    btn.addEventListener('click', () => dialog.close());
  });

  // Backdrop click: only fires when the click target is the <dialog> itself
  // (the content sits inside .modal-body, so clicks inside it never reach here).
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
});
