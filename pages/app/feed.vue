<script setup lang="ts">
import Post from "~/components/feed/Post.vue";

definePageMeta({
  name: "Feed",
  title: "Feed",
});

const user = useUserStore().getUser;

const { data, refresh } = useFetch("/api/post/getPosts", {
  method: "GET",
});

const postContent = ref("");

async function createPost() {
  await useFetch("/api/post/createPost", {
    method: "POST",
    body: {
      content: postContent.value,
      userId: user?.id,
    },
  });
  refresh();
  postContent.value = "";
}
</script>

<template>
  <div>
    <div class="flex items-start space-x-4 py-4 px-6 border-b border-muted">
      <img class="inline-block h-10 w-10 rounded-full" :src="user.avatar" alt="" />
      <form @submit.prevent="createPost" class="relative w-full">
        <textarea v-model="postContent" rows="3" class="input p-3" placeholder="Tell us what you think..." />
        <button type="submit" class="btn btn-primary float-right" :disabled="postContent === ''">Post</button>
      </form>
    </div>
    <ul role="list">
      <li v-for="post in data" :key="post.id" class="px-6 py-4 border-b border-muted">
        <Post @delete="refresh" :id="post.id" :user="post.User" :content="post.content" :created-at="post.createdAt" />
      </li>
    </ul>
  </div>
</template>
