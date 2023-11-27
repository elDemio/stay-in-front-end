<script setup>
import { RouterView, useRoute } from 'vue-router'
import { ref, watch } from 'vue';

import TheHeader from './components/header/TheHeader.vue';
import TheFooter from './components/footer/TheFooter.vue'

const isVisible = ref(true);
const route = useRoute();

watch(() => route.path, (newPath) => {
  isVisible.value = newPath !== '/error' && newPath !== '/nueva';
});

</script>

<template>
  <TheHeader v-if="isVisible" />
  <main class="mb-5">
    <RouterView />
  </main>
  <TheFooter v-if="isVisible && route.name !== 'anuncios'" />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Roboto Condensed', sans-serif;
  scroll-behavior: smooth;
}

:root {
  --primary-color: #1d3557;
  --secondary-color: #343a40;
  --tertiary-color: #6a6a6a;
  --acent-color: #a6a6a6;
  --hovering-color: #3d3b3b15;
  --button-action-color: #264877ec;
  --danger-color: #8a0f32;
}
</style>
