<script setup lang="ts">
defineProps({
  comments: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <div class="flex flex-col space-y-4">
    <div
      v-for="comment in comments"
      :key="comment.id"
      class="flex items-start space-x-4 py-4 px-6 border-b border-muted"
    >
      <img class="inline-block h-10 w-10 rounded-full" :src="comment.user.avatar" alt="" />
      <div class="flex-1 space-y-2">
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-medium">{{ comment.user.firstname }} {{ comment.user.lastname }}</h3>
          <p class="text-sm text-muted">{{ comment.createdAt }}</p>
        </div>
        <p class="text-sm">{{ comment.content }}</p>
      </div>
    </div>
  </div>
</template>
