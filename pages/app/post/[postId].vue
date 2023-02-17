<script setup lang="ts">
import Post from "~/components/feed/Post.vue";
import CommentForm from "~/components/feed/commentForm.vue";

const postId = useRoute().params.postId;
const currentUser = useUserStore().getUser;

const { data: post } = useFetch("/api/post/" + postId, {
  method: "GET",
});
</script>

<template>
  <div class="p-6">
    <Post
      :id="post.id"
      :user="post.user"
      :content="post.content"
      :created-at="post.createdAt"
      :nb-likes="post._count.likes"
    />
    <div class="mt-4 border-t border-muted">
      <CommentForm :postId="post.id" />
      <CommentList :postId="post.id" />
    </div>
  </div>
</template>
