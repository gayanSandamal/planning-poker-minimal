import type { App } from "vue";

let vueApp: App<Element> | null = null;

export function setVueApp(app: App<Element>): void {
  vueApp = app;
}

let firebaseReady: Promise<void> | null = null;

type VueAppWithFlag = App<Element> & { __vueFireInstalled?: boolean };

export async function ensureFirebase(): Promise<void> {
  if (firebaseReady) return firebaseReady;
  firebaseReady = (async () => {
    if (!vueApp) return;
    if ((vueApp as VueAppWithFlag).__vueFireInstalled) return;
    const [{ firebaseApp }] = await Promise.all([import("./fb.appdata")]);
    const { VueFire, VueFireAuth } = await import("vuefire");
    vueApp.use(VueFire, {
      firebaseApp,
      modules: [VueFireAuth()],
    });
    (vueApp as VueAppWithFlag).__vueFireInstalled = true;
  })();
  return firebaseReady;
}
