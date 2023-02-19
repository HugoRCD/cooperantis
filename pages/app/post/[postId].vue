<script setup lang="ts">
import { ArrowUturnLeftIcon } from "@heroicons/vue/24/outline";
import Post from "~/components/feed/Post.vue";
import CommentForm from "~/components/feed/CommentForm.vue";
import CommentList from "~/components/feed/CommentList.vue";
import PostLoader from "~/components/loader/PostLoader.vue";

const postId = useRoute().params.postId;
const currentUser = useUserStore().getUser;

const {
  data: post,
  pending,
  refresh,
} = useLazyFetch("/api/post/" + postId, {
  method: "POST",
  body: {
    userId: currentUser?.id,
  },
});
</script>

<template>
  <div>
    <PostLoader :nb-posts="1" v-if="pending" />
    <div class="p-6" v-else>
      <div class="flex items-center space-x-4 mb-6">
        <RouterLink to="/app/feed">
          <ArrowUturnLeftIcon class="h-6 w-6" />
        </RouterLink>
        <div class="flex-1">
          <h1 class="text-2xl font-bold">Post</h1>
        </div>
      </div>
      <Post :post="post" :user="post.user" />
      <div class="mt-4 border-t border-muted">
        <CommentForm :postId="post.id" :refresh="refresh" />
        <CommentList :comments="post.comments" :refresh="refresh" />
      </div>
    </div>
  </div>
</template>
