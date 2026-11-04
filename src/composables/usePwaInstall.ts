import { ref, computed } from "vue";
import { track } from "@/analytics";

/**
 * "Install the app" prompt. Browsers that support it (Chrome, Edge, Android)
 * fire `beforeinstallprompt`; we hold on to it and offer it at a good moment
 * (after a round is revealed) instead of interrupting on first visit.
 */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISSED_KEY = "ppm.installDismissedAt";
const ASK_AGAIN_AFTER_MS = 30 * 24 * 60 * 60 * 1000;

const deferred = ref<BeforeInstallPromptEvent | null>(null);
const wanted = ref(false);

function recentlyDismissed(): boolean {
  try {
    const at = Number(localStorage.getItem(DISMISSED_KEY) ?? 0);
    return Date.now() - at < ASK_AGAIN_AFTER_MS;
  } catch {
    return false;
  }
}

function isStandalone(): boolean {
  return (
    window.matchMedia?.("(display-mode: standalone)").matches ||
    (navigator as Navigator & { standalone?: boolean }).standalone === true
  );
}

/** Call once at startup, before the browser fires the event. */
export function listenForInstallPrompt(): void {
  window.addEventListener("beforeinstallprompt", (e) => {
    e.preventDefault();
    deferred.value = e as BeforeInstallPromptEvent;
  });
  window.addEventListener("appinstalled", () => {
    deferred.value = null;
    wanted.value = false;
    void track("pwa_installed");
  });
}

export function usePwaInstall() {
  const visible = computed(
    () =>
      wanted.value &&
      deferred.value !== null &&
      !isStandalone() &&
      !recentlyDismissed()
  );

  /** Ask to show the prompt; it appears only if the browser allows it. */
  const offer = () => {
    if (wanted.value || !deferred.value || recentlyDismissed()) return;
    wanted.value = true;
    void track("pwa_prompt_shown");
  };

  const install = async () => {
    const e = deferred.value;
    if (!e) return;
    wanted.value = false;
    await e.prompt();
    const { outcome } = await e.userChoice;
    void track("pwa_prompt_result", { outcome });
    deferred.value = null;
    if (outcome === "dismissed") dismiss();
  };

  const dismiss = () => {
    wanted.value = false;
    try {
      localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    } catch {
      // ignore
    }
  };

  return { visible, offer, install, dismiss };
}
