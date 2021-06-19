import { createRouter, createWebHistory } from "vue-router";

import App from "./App.vue";
import ArraySort from "@/views/ArraySort.vue";
import PathFinder from "@/views/PathFinder.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      name: "SortingAlgos",
      component: ArraySort
    },
    {
      path: "/path-finding-algos",
      name: "PathFindingAlgos",
      component: PathFinder
    }
  ]
});
