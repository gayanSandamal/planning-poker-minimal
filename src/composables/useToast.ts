import { getCurrentInstance } from "vue";

let installed = false;

export function useToast() {
  const app = getCurrentInstance()?.appContext.app;

  async function ensureToast(): Promise<void> {
    if (installed && app) return;
    const { default: Toast } = await import("vue3-toastify");
    await import("vue3-toastify/dist/index.css");
    if (app && !(app as { _toastInstalled?: boolean })._toastInstalled) {
      app.use(Toast);
      (app as { _toastInstalled?: boolean })._toastInstalled = true;
      installed = true;
    }
  }

  return {
    async success(
      message: string,
      options?: { autoClose?: number }
    ): Promise<void> {
      await ensureToast();
      const { toast } = await import("vue3-toastify");
      toast.success(message, { autoClose: options?.autoClose ?? 3000 });
    },
    async error(
      message: string,
      options?: { autoClose?: number }
    ): Promise<void> {
      await ensureToast();
      const { toast } = await import("vue3-toastify");
      toast.error(message, { autoClose: options?.autoClose ?? 4000 });
    },
  };
}
