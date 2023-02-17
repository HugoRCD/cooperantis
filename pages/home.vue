<script setup lang="ts">
definePageMeta({
  title: "Home",
  name: "Home",
  path: "/",
  description: "Home page",
  keywords: "Home",
});

function test() {
  useTestToast("Ceci est un test");
}
</script>

<template>
  <main class="min-h-full bg-cover bg-center bg-no-repeat bg-primary">
    <div class="mx-auto max-w-7xl py-16 px-6 text-center sm:py-24 lg:px-8 lg:py-48">
      <h1 class="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
        {{ $t("pages.home.hero") }}
      </h1>
      <p class="mt-2 text-lg font-medium text-muted">
        {{ $t("pages.home.description") }}
      </p>
      <div class="mt-6 flex justify-center">
        <NuxtLink to="/contact" class="btn-primary"> Contact </NuxtLink>
      </div>
    </div>
  </main>
</template>
