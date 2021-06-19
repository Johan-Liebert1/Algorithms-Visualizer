import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router";
import Router from "vue-router";

import App from "./App.vue";
import ArraySort from "@/views/ArraySort.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "SortingAlgos",
    component: App
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;
