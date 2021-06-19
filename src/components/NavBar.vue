<template>
  <nav>
    <RouterLink to="/" :class="{ selected: $route.name === 'SortingAlgos' }"
      >Sorting Algorithms</RouterLink
    >
    <RouterLink
      to="/path-finding-algos"
      :class="{ selected: $route.name === 'PathFindingAlgos' }"
      >Path Finding Algorithms</RouterLink
    >
  </nav>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  name: "NavBar"
});
</script>

<style scoped>
nav {
  width: 100vw;
  height: 10vh;
  background-color: white;
  color: black;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.selected {
  color: #4eb380;
  border-bottom: 5px solid #32475b;
}

a {
  text-decoration: none;
  color: black;
  font-weight: bolder;
  border-bottom: 5px solid transparent;
}

a:hover {
  color: #4eb380;
  border-bottom: 5px solid #32475b;
}
</style>
