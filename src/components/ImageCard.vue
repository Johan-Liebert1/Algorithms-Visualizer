<template>
  <RouterLink :to="routePath">
    <div class="card">
      <div class="card-image">
        <figure class="image is-5by3">
          <img :src="imageSrc" alt="Placeholder image" />
        </figure>
      </div>
      <div class="card-content">
        <div class="media">
          <div class="media-content">
            <p class="title is-4">{{ name }}</p>
          </div>
        </div>

        <div class="content">
          Some awesome sorting algos
        </div>
      </div>
    </div>
  </RouterLink>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    imageSrc: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    routePath: {
      type: String,
      required: true
    }
  }
});
</script>

<style scoped>
.card {
  width: 300px;
  transition: all 200ms linear;
  height: 100%;
}

.card:hover {
  transform: scale(1.1, 1.1);
  box-shadow: 0 0 1.2rem white;
}
</style>
