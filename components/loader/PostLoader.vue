<script setup lang="ts">
defineProps({
  nbPosts: {
    type: Number,
    required: true,
  },
});
</script>

<template>
  <div>
    <div class="border border-muted shadow rounded-md px-8 py-8 w-full" v-for="i in nbPosts" :key="i">
      <div class="animate-pulse flex space-x-4">
        <div class="rounded-full bg-secondary h-10 w-10"></div>
        <div class="flex-1 space-y-6 py-1">
          <div class="h-2 bg-secondary rounded"></div>
          <div class="space-y-3">
            <div class="grid grid-cols-3 gap-4">
              <div class="h-2 bg-secondary rounded col-span-2"></div>
              <div class="h-2 bg-secondary rounded col-span-1"></div>
            </div>
            <div class="h-2 bg-secondary rounded"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
