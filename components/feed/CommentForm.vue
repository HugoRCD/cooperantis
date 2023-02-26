<script setup lang="ts">
const props = defineProps({
  postId: {
    type: Number,
    required: true,
  },
  refresh: {
    type: Function,
    required: true,
  },
});

const currentUser = useUserStore().getUser;

const commentContent = ref("");

async function addComment() {
  await useLazyFetch("/api/post/comment/" + props.postId, {
    method: "POST",
    body: {
      content: commentContent.value,
      userId: currentUser?.id,
    },
  });
  commentContent.value = "";
  props.refresh();
}
</script>

<template>
  <form class="flex items-start space-x-4 py-4 px-6 border-b border-muted" @submit.prevent="addComment">
    <img class="inline-block h-10 w-10 rounded-full object-cover" :src="currentUser.avatar" alt="" />
    <textarea
      autofocus
      rows="2"
      v-model="commentContent"
      class="input p-3 bg-transparent border-none"
      placeholder="Write a comment..."
    />
    <button type="submit" class="btn-primary" :disabled="commentContent === ''">Post</button>
  </form>
</template>
