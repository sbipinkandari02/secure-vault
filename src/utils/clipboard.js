export function clearClipboardAfter(delay = 3000) {
  setTimeout(async () => {
    try {
      await navigator.clipboard.writeText("");
    } catch (e) {
      console.error("Clipboard clear failed", e);
    }
  }, delay);
}
