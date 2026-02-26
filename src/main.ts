import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import { setVueApp } from "@/firebase/init";
import "bootstrap-icons/font/bootstrap-icons.css";

const app = createApp(App).use(store).use(router);
setVueApp(app);
app.mount("#app");

const preloader = document.getElementById("app-preloader");
if (preloader) {
  preloader.classList.add("hidden");
  let removed = false;
  const removePreloader = () => {
    if (removed) return;
    removed = true;
    preloader.remove();
  };
  preloader.addEventListener("transitionend", removePreloader, { once: true });
  setTimeout(removePreloader, 500);
}

if (typeof requestIdleCallback !== "undefined") {
  requestIdleCallback(() => import("./registerServiceWorker"), {
    timeout: 2000,
  });
} else {
  setTimeout(() => import("./registerServiceWorker"), 2000);
}
