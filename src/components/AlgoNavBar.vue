<template>
  <div class="nav-container">
    <div class="home">
      <RouterLink to="/"> <h1 class="is-size-2">Home</h1> </RouterLink>
    </div>

    <div class="options-container">
      <div class="dropdown-container">
        <h1 class="is-size-4" @click="algoDropdownVisible = !algoDropdownVisible">
          Algorithms <slot />
        </h1>
        <Dropdown
          v-if="algoDropdownVisible"
          :dropdownItems="algorithmsList"
          :selectedAlgo="selectedAlgo"
          @selectionChanged="value => $emit('algorithmChanged', value)"
        />
      </div>

      <div class="dropdown-container">
        <h1 class="is-size-4" @click="speedDropdownVisible = !speedDropdownVisible">
          Speed <slot />
        </h1>
        <Dropdown v-if="speedDropdownVisible" :dropdownItems="null">
          <p>Speed: {{ algoSpeed / 1000 }}s</p>
          <input
            type="range"
            min="50"
            max="2000"
            step="50"
            class="slider"
            :value="algoSpeed"
            @change="$emit('update:algoSpeed', parseInt($event.target.value))"
          />
        </Dropdown>
      </div>

      <div class="action-buttons-container">
        <button
          v-for="btn in buttonsList"
          :key="btn.text"
          @click="btn.handler"
          :class="{ [btn.class]: true }"
          style="margin-right: 0.5rem"
        >
          {{ btn.text }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Dropdown from "@/components/Drodown.vue";

export default defineComponent({
  name: "AlgoNavBar",
  components: { Dropdown },
  props: {
    algorithmsList: {
      type: Array,
      required: true
    },
    buttonsList: {
      type: Array,
      required: true
    },
    algoSpeed: {
      type: Number,
      required: false
    },
    selectedAlgo: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      algoDropdownVisible: false,
      speedDropdownVisible: false,
      sortSpeed: 10
    };
  }
});
</script>

<style scoped>
.nav-container {
  width: 100vw;
  background-color: white;
  height: 10vh;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.home {
  width: 10%;
  text-align: right;
}

.options-container {
  width: 90%;
  height: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  color: cornflowerblue;
}

.dropdown-container {
  height: 100%;
  display: flex;
  align-items: center;
  position: relative;
}

.dropdown-container:hover {
  cursor: pointer;
}

.action-buttons-container {
  min-width: 30%;
  display: flex;
  justify-content: space-evenly;
}
</style>
