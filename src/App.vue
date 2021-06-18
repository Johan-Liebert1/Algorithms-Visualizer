<template>
  <h1>{{ name }} - {{ age }}</h1>
  <button @click="changeName('Tenma')">ChangeName</button>
  <button @click="changeAge('36')">Age</button>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";

export default defineComponent({
  name: "App",
  components: {},
  setup() {
    const state = reactive({
      name: "Johan",
      age: 25 as number | string
    });

    return { ...toRefs(state) };
  },
  methods: {
    changeName(newName: string) {
      this.name = newName;
    },

    changeAge(newAge: number | string) {
      this.age = newAge;
    }
  }
});
</script>

<style></style>
