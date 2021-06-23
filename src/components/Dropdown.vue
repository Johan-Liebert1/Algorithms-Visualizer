<template>
  <div class="dropdown" ref="dropdownList">
    <div v-if="dropdownItems">
      <div
        v-for="(item, i) in dropdownItems"
        :key="i"
        :class="{ 'dropdown-item': true, selected: item === selectedAlgo }"
        @click="$emit('selectionChanged', item)"
      >
        {{ item }}
      </div>
    </div>
    <div v-else>
      <div class="dropdown-slot">
        <slot />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Dropdown",
  props: {
    dropdownItems: {},
    selectedAlgo: {
      type: String
    }
  }
});
</script>

<style scoped>
.dropdown {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  position: absolute;
  top: 100%;
  left: -50%;
  min-width: 200%;
  background-color: #32475b;
  border-radius: 5px;
}

@keyframes grow {
  0% {
    transform: scale(0, 0);
  }

  100% {
    transform: scale(1, 1);
  }
}

.dropdown-item,
.dropdown-slot {
  height: 100%;
  width: 100%;
  padding: 0.5rem 1rem;
  color: #4eb380;
  font-size: 1.1rem;
  border-radius: 5px;
}

.dropdown-item:hover {
  background-color: #4eb380;
  color: #32475b;
}

.selected {
  background-color: #4eb380;
  color: #32475b;
}
</style>
