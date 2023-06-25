import { createApp } from "vue";
import { VueFire, VueFireAuth } from "vuefire";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import { firebaseApp } from "@/firebase/fb.appdata";

createApp(App)
  .use(store)
  .use(router)
  .use(VueFire, {
    // imported above but could also just be created here
    firebaseApp,
    modules: [
      // we will see other modules later on
      VueFireAuth(),
    ],
  })
  .mount("#app");
