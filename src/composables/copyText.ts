/**
 * Copy text to the clipboard. Falls back to a hidden textarea +
 * execCommand where the async Clipboard API is missing or refused
 * (older Safari, some in-app browsers and webviews).
 */
export async function copyText(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    return;
  } catch {
    // fall through to the legacy path
  }
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.setAttribute("readonly", "");
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  try {
    if (!document.execCommand("copy")) throw new Error("copy refused");
  } finally {
    ta.remove();
  }
}
