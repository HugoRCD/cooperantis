<script setup lang="ts">
import { TrashIcon } from "@heroicons/vue/24/outline";

const props = defineProps({
  comments: {
    type: Array,
    required: true,
  },
  refresh: {
    type: Function,
    required: true,
  },
});
async function deleteComment(commentId: number) {
  if (confirm("Are you sure you want to delete this comment?")) {
    await useFetch("/api/post/comment/" + commentId, {
      method: "DELETE",
    });
    props.refresh();
  }
}
</script>

<template>
  <div class="flex flex-col space-y-4">
    <div
      v-for="comment in comments"
      :key="comment.id"
      class="flex items-start space-x-4 py-4 px-6 border-b border-muted"
    >
      <img class="inline-block h-10 w-10 rounded-full object-cover" :src="comment.user.avatar" alt="" />
      <div class="flex-1 space-y-2">
        <div class="flex items-center justify-between">
          <NuxtLink :to="`/app/profile/${comment.user.id}`">
            <h3 class="text-lg font-medium hover:underline">
              {{ comment.user.firstname }} {{ comment.user.lastname }}
            </h3>
          </NuxtLink>
          <p class="text-sm text-muted">{{ comment.createdAt }}</p>
        </div>
        <p class="text-sm">{{ comment.content }}</p>
      </div>
      <div v-if="comment.owner" class="flex items-center space-x-2">
        <TrashIcon class="h-6 w-6 text-muted hover:text-primary cursor-pointer" @click="deleteComment(comment.id)" />
      </div>
    </div>
  </div>
</template>
