<script setup>
import { RouterView } from "vue-router";
import { useProductStore } from "./store";
import { computed } from "vue";

const store = useProductStore();
const theme = computed(() => store.darkTheme);
</script>

<template>
  <div class="" :class="{ 'bg-[#1c1b1e] text-white': theme }">
    <RouterView />
  </div>
</template>
