import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalized,
  type RouteRecordRaw,
} from "vue-router";
import { ensureFirebase } from "@/firebase/init";
import { trackPageView } from "@/analytics";

const firebaseGuard = async (
  _to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext
): Promise<void> => {
  await ensureFirebase();
  next();
};

const DEFAULT_TITLE =
  "Planning Poker Minimal — Estimate together, ship with confidence";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "home",
    meta: { title: DEFAULT_TITLE },
    component: () =>
      import(/* webpackChunkName: "home" */ "../views/HomeView.vue"),
  },
  {
    path: "/about",
    name: "about",
    meta: { title: "About — Planning Poker Minimal" },
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/AboutView.vue"),
  },
  {
    path: "/privacy",
    name: "privacy",
    meta: { title: "Privacy & cookies — Planning Poker Minimal" },
    component: () =>
      import(/* webpackChunkName: "privacy" */ "../views/PrivacyView.vue"),
  },
  {
    path: "/:id",
    name: "game",
    meta: { title: "Game — Planning Poker Minimal" },
    beforeEnter: firebaseGuard,
    component: () =>
      import(/* webpackChunkName: "game" */ "../views/GameView.vue"),
  },
  {
    path: "/new-game",
    name: "newgame",
    meta: { title: "New Game — Planning Poker Minimal" },
    beforeEnter: firebaseGuard,
    component: () =>
      import(/* webpackChunkName: "new-game" */ "../views/NewGameView.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.afterEach((to: RouteLocationNormalized) => {
  const meta = to.meta as Record<string, unknown> | undefined;
  const title = (meta?.title as string) ?? DEFAULT_TITLE;
  document.title = title;
  void trackPageView(to.path, title, to.name as string | undefined);
});

export default router;
