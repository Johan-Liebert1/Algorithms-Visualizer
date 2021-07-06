<template>
  <div>
    <Navigation v-if="$route.name === 'Home'" />
    <RouterView :key="$route.fullPath" v-if="$route.name !== 'Home'" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Navigation from "./components/Navigation.vue";
import "bulmaswatch/flatly/bulmaswatch.min.css";

export default defineComponent({
  name: "App",
  components: { Navigation }
});
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: #02203a;
  color: rgb(200, 200, 200);
  font-family: "Helvetica Neue", "Avenir", Helvetica, Arial, sans-serif;
  min-height: 100vh;
}

.container {
  width: 90%;
  margin: 0 auto;
}

input[type="range"] {
  -webkit-appearance: none;
  height: 1px;
  background-color: white;
}

input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none; /* Override default look */
  appearance: none;
  background: #4eb380; /* Green background */
  width: 10px; /* Set a specific slider handle width */
  height: 10px; /* Slider handle height */
  border-radius: 50%;
}

input[type="range"]::-moz-range-thumb {
  width: 10px; /* Set a specific slider handle width */
  height: 10px; /* Slider handle height */
  background: #4eb380; /* Green background */
  border-radius: 50%;
}
</style>
