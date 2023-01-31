<script setup lang="ts">
definePageMeta({
  title: "Home",
  name: "Home",
  path: "/",
  description: "Home page",
  keywords: "Home",
});
</script>

<template>
  <main class="min-h-full bg-cover bg-center bg-no-repeat bg-primary">
    <div
      class="mx-auto max-w-7xl py-16 px-6 text-center sm:py-24 lg:px-8 lg:py-48"
    >
      <h1 class="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
        Cooperantis is coming soon
      </h1>
      <p class="mt-2 text-lg font-medium text-muted">
        We are working hard to get this ready for you.
      </p>
      <div class="mt-6 flex justify-center">
        <NuxtLink to="/" class="btn-primary w-1/6"> Contact </NuxtLink>
      </div>
    </div>
  </main>
</template>
