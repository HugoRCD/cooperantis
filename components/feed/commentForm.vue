<script setup lang="ts">
defineProps({
  postId: {
    type: Number,
    required: true,
  },
});

const currentUser = useUserStore().getUser;

const commentContent = ref("");

async function addComment() {
  commentContent.value = "";
}
</script>

<template>
  <div class="flex items-start space-x-4 py-4 px-6 border-b border-muted">
    <img class="inline-block h-10 w-10 rounded-full" :src="currentUser.avatar" alt="" />
    <textarea
      autofocus
      rows="2"
      v-model="commentContent"
      class="input p-3 bg-transparent border-none"
      placeholder="Write a comment..."
    />
    <button type="submit" class="btn-primary" :disabled="commentContent === ''">Post</button>
  </div>
</template>
