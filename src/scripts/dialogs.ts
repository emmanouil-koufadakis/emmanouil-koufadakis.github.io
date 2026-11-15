/**
 * Progressive enhancement for links with [data-dialog-open="<dialog id>"].
 * Without JS they jump to the matching entry in "Full CV"; with JS they open
 * the details dialog. Esc and a click on the backdrop close it, and the
 * browser returns focus to the card that opened it.
 */
export function initDialogs() {
  document.addEventListener('click', (event) => {
    const opener = (event.target as HTMLElement).closest<HTMLElement>('[data-dialog-open]');
    if (opener) {
      const dialog = document.getElementById(opener.dataset.dialogOpen!) as HTMLDialogElement | null;
      if (dialog && typeof dialog.showModal === 'function') {
        event.preventDefault();
        dialog.showModal();
      }
      return;
    }
    // Click on the backdrop (the dialog element itself, outside its panel).
    const target = event.target as HTMLElement;
    if (target instanceof HTMLDialogElement && target.open) target.close();
  });
}
