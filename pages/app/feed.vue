<script setup lang="ts">
import Post from "~/components/feed/Post.vue";
import PostLoader from "~/components/loader/PostLoader.vue";

definePageMeta({
  name: "Feed",
  title: "Feed",
});

const user = useUserStore().getUser;

const { data, refresh, pending } = await useLazyFetch("/api/post/getPosts", {
  method: "POST",
  body: {
    userId: user?.id,
  },
});

const postContent = ref("");

async function addPost() {
  await createPost(postContent.value);
  refresh();
  postContent.value = "";
}
</script>

<template>
  <div class="-m-4">
    <div class="flex items-start space-x-4 py-4 px-6 border-b border-muted">
      <img class="inline-block h-10 w-10 rounded-full" :src="user.avatar" alt="" />
      <form @submit.prevent="addPost" class="relative w-full">
        <textarea v-model="postContent" rows="3" class="input p-3" placeholder="Tell us what you think..." />
        <button type="submit" class="btn btn-primary float-right" :disabled="postContent === ''">Post</button>
      </form>
    </div>
    <PostLoader v-if="pending" :nb-posts="6" />
    <ul role="list" v-else>
      <li
        v-for="post in data"
        :key="post.id"
        class="px-8 py-6 border-b border-muted hover:bg-secondary-opacity/20 transition-colors duration-200"
      >
        <div>
          <Post @delete="refresh" :post="post" :user="post.user" />
        </div>
      </li>
    </ul>
  </div>
</template>

//:to="`/app/post/${post.id}`"
