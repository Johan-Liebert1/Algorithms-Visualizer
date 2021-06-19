<template>
  <NavBar />
  <div class="container">
    <RouterView />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import NavBar from "./components/NavBar.vue";
import "bulmaswatch/flatly/bulmaswatch.min.css";

export default defineComponent({
  name: "App",
  components: { NavBar }
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
</style>
