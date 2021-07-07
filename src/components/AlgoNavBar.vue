<template>
  <div class="nav-container">
    <div class="home">
      <RouterLink to="/">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          fill="currentColor"
          class="bi bi-house-fill"
          viewBox="0 0 16 16"
        >
          <path
            fill-rule="evenodd"
            d="m8 3.293 6 6V13.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 2 13.5V9.293l6-6zm5-.793V6l-2-2V2.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5z"
          />
          <path
            fill-rule="evenodd"
            d="M7.293 1.5a1 1 0 0 1 1.414 0l6.647 6.646a.5.5 0 0 1-.708.708L8 2.207 1.354 8.854a.5.5 0 1 1-.708-.708L7.293 1.5z"
          />
        </svg>
      </RouterLink>
    </div>

    <div class="options-container">
      <div class="dropdown-container-container">
        <div
          class="dropdown-container"
          :style="algoDropdownVisible ? dropdownStyle : normalStyle"
        >
          <h1 class="is-size-4" @click="algoDropdownVisible = !algoDropdownVisible">
            Algorithms <slot />
          </h1>
          <Dropdown
            v-if="algoDropdownVisible"
            :dropdownItems="algorithmsList"
            :selectedAlgo="selectedAlgo"
            @selectionChanged="algorithmChanged"
          />
        </div>

        <div
          class="dropdown-container"
          :style="speedDropdownVisible ? dropdownStyle : normalStyle"
        >
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

        <div
          class="dropdown-container"
          :style="cellSizeDropdownVisible ? dropdownStyle : normalStyle"
        >
          <h1
            class="is-size-4"
            @click="cellSizeDropdownVisible = !cellSizeDropdownVisible"
          >
            Cell Size <slot />
          </h1>
          <Dropdown v-if="cellSizeDropdownVisible" :dropdownItems="null">
            <p>Size: {{ cellSize }}</p>
            <input
              type="range"
              min="10"
              max="30"
              step="5"
              class="slider"
              :value="cellSize"
              @change="$emit('update:cellSize', parseInt($event.target.value))"
            />
          </Dropdown>
        </div>

        <div
          class="dropdown-container"
          v-if="showMazeDropdown"
          :style="mazeDropdownVisible ? dropdownStyle : normalStyle"
        >
          <h1 class="is-size-4" @click="mazeDropdownVisible = !mazeDropdownVisible">
            Mazes <slot />
          </h1>
          <Dropdown
            v-if="mazeDropdownVisible"
            :dropdownItems="mazeGenAlgorithmsList"
            @selectionChanged="mazeGenerationAlgoSelected"
          >
          </Dropdown>
        </div>
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
import Dropdown from "@/components/Dropdown.vue";

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
    cellSize: {
      type: Number,
      required: false
    },
    selectedAlgo: {
      type: String,
      required: true
    },
    showMazeDropdown: {
      type: Boolean,
      default: false
    },
    mazeGenAlgorithmsList: {
      type: Array,
      required: false
    }
  },
  data() {
    return {
      algoDropdownVisible: false,
      speedDropdownVisible: false,
      mazeDropdownVisible: false,
      cellSizeDropdownVisible: false,
      normalStyle: {
        color: "#ddd"
      },
      dropdownStyle: {
        color: "#34ace0"
      }
    };
  },
  methods: {
    algorithmChanged(value: string) {
      this.$emit("algorithmChanged", value);
      this.algoDropdownVisible = false;
    },
    mazeGenerationAlgoSelected(value: string) {
      this.$emit("mazeGenerationAlgoSelected", value);
      this.mazeDropdownVisible = false;
    }
  }
});
</script>

<style scoped>
.nav-container {
  width: 100vw;
  background-color: #2c3e50;
  min-height: 7vh;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.home {
  width: 3%;
  text-align: center;
}

.options-container {
  width: 95%;
  height: 7vh;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

.dropdown-container-container {
  width: 60%;
  height: 100%;
  display: flex;
  justify-content: space-evenly;
}

.dropdown-container {
  height: 100%;
  width: 25%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.dropdown-container:hover {
  cursor: pointer;
}

.action-buttons-container {
  min-width: 40%;
  display: flex;
  justify-content: center;
}
</style>
