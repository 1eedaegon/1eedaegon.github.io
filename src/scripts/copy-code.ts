/**
 * Add copy button to code blocks
 */
import { trackCodeCopy } from "../utils/analytics";

function addCopyButtons() {
  const codeBlocks = document.querySelectorAll("pre");

  codeBlocks.forEach((pre) => {
    if (pre.dataset.copyButtonInitialized === "true") return;

    const existingWrapper = pre.parentElement?.classList.contains(
      "code-block-wrapper",
    )
      ? pre.parentElement
      : null;

    const wrapper = existingWrapper ?? document.createElement("div");
    wrapper.classList.add("code-block-wrapper");

    if (!existingWrapper) {
      pre.parentNode?.insertBefore(wrapper, pre);
      wrapper.appendChild(pre);
    }

    // Create copy button
    const button = document.createElement("button");
    button.className = "copy-button";
    button.setAttribute("aria-label", "Copy code");
    button.innerHTML = `
      <svg class="copy-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
      <svg class="check-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    `;

    if (!wrapper.querySelector(".copy-button")) {
      button.addEventListener("click", async () => {
        const code =
          pre.querySelector("code")?.textContent || pre.textContent || "";

        const codeElement = pre.querySelector("code");
        const languageClass = codeElement?.className.match(/language-(\w+)/);
        const language =
          pre.dataset.language ||
          (languageClass ? languageClass[1] : undefined);

        try {
          await navigator.clipboard.writeText(code);
          button.classList.add("copied");

          trackCodeCopy(language);

          if (typeof (window as any).showToast === "function") {
            (window as any).showToast(
              "Code copied to clipboard!",
              "success",
              2000,
            );
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

      wrapper.appendChild(button);
    }

    pre.dataset.copyButtonInitialized = "true";
  });
}

// Initialize on page load
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", addCopyButtons);
} else {
  addCopyButtons();
}

// Re-initialize after view transitions
document.addEventListener("astro:after-swap", addCopyButtons);
