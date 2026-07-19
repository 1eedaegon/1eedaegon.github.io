/**
 * Copy-to-clipboard for code blocks.
 * The wrapper, watermark, and button markup are server-rendered by
 * src/utils/rehype-code-blocks.ts — this script only handles clicks.
 * A single delegated listener survives view-transition swaps with no re-init.
 */
import { trackCodeCopy } from "../utils/analytics";

document.addEventListener("click", async (event) => {
  const target = event.target as HTMLElement | null;
  const button = target?.closest?.(".copy-button") as HTMLButtonElement | null;
  if (!button) return;

  const wrapper = button.closest(".code-block-wrapper");
  const pre = wrapper?.querySelector("pre");
  if (!pre) return;

  const code = pre.querySelector("code")?.textContent || pre.textContent || "";
  const language =
    (pre as HTMLElement).dataset.language ||
    pre.querySelector("code")?.className.match(/language-(\w+)/)?.[1];

  try {
    await navigator.clipboard.writeText(code);
    button.classList.add("copied");

    trackCodeCopy(language);

    if (typeof (window as any).showToast === "function") {
      (window as any).showToast("Code copied to clipboard!", "success", 2000);
    }

    setTimeout(() => {
      button.classList.remove("copied");
    }, 2000);
  } catch (_err) {
    if (typeof (window as any).showToast === "function") {
      (window as any).showToast("Failed to copy code", "error", 2000);
    }
  }
});
