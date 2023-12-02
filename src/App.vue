<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <hr />
      <RouterLink to="/CarouselView">CarouselView</RouterLink>
      <hr />
      <RouterLink to="/ListView">ListView</RouterLink>
      <hr />
      <RouterLink to="/FileUploadView">FileUploadView</RouterLink>
      <hr />
      <RouterLink to="/DownloadView">DownloadView</RouterLink>
      <hr />
      <RouterLink to="/DialogView">DialogView</RouterLink>
    </nav>
  </header>

  <RouterView />
</template>

<style scoped lang="scss"></style>
