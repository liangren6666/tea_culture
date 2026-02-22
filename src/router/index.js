import { createRouter, createWebHashHistory } from "vue-router";
import HomePage from "../views/HomePage.vue";

const routes = [
  { path: "/", name: "Home", component: HomePage },
  { path: "/compare", name: "Compare", component: () => import("../views/ComparePage.vue") },
  { path: "/origins", name: "Origins", component: () => import("../views/OriginsPage.vue") },
  { path: "/innovation", name: "Innovation", component: () => import("../views/InnovationPage.vue") },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;



