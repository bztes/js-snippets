import App from "./components/app.js";
import View1 from "./components/view1.js";
import View2 from "./components/view2.js";

const router = VueRouter.createRouter({
  history: VueRouter.createMemoryHistory(),
  routes: [
    { path: "/", component: View1 },
    { path: "/view2", component: View2 },
  ],
});

const app = Vue.createApp(App);
app.use(router);
app.mount("#app");
