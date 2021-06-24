<template>
  <div class="container">
    <h1 class="title">Algorithm Visualizer</h1>
    <div class="is-flex cards-container">
      <ImageCard
        v-for="card in imageCards"
        :imageSrc="card.imageSrc"
        :name="card.name"
        :routePath="card.routePath"
        :key="card.routePath"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import ImageCard from "./ImageCard.vue";

export default defineComponent({
  components: { ImageCard },
  name: "Navigation",
  data() {
    return {
      imageCards: [
        // get gifs of the algos working and use them as image sources
        {
          name: "Sorting",
          imageSrc: "/images/sortingSS.png",
          routePath: "/sorting-algos"
        },
        {
          name: "Path Finders and Maze Generators",
          imageSrc: "/images/pathFindingSS.png",
          routePath: "/path-finding-algos"
        }
      ]
    };
  }
});
</script>

<style scoped>
.container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}

.title {
  color: rgb(200, 200, 200);
  text-align: center;
  justify-self: flex-start;
}

.cards-container {
  justify-content: space-evenly;
  flex-wrap: wrap;
}
</style>
