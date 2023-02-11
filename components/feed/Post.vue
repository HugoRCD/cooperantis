<script setup lang="ts">
import { HeartIcon, TrashIcon } from "@heroicons/vue/24/outline";

const currentUser = useUserStore().getUser;

defineProps({
  id: {
    type: Number,
    required: true,
  },
  user: {
    type: Object,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(["delete"]);

async function deletePost(postId: number) {
  if (confirm("Are you sure you want to delete this post?")) {
    await useFetch("/api/post/deletePost", {
      method: "DELETE",
      body: {
        postId,
      },
    });
    emit("delete");
  }
}
</script>

<template>
  <div class="bg-secondary border border-muted rounded-lg p-4 mb-4">
    <NuxtLink class="flex items-center" :to="`/app/profile/${user.id}`">
      <img :src="user.avatar" alt="" class="w-12 h-12 rounded-full mr-4" />
      <div>
        <h2 class="text-lg font-semibold text-primary">{{ user.firstname }} {{ user.lastname }}</h2>
      </div>
    </NuxtLink>
    <div class="mt-4">
      <p class="text-lg leading-7 text-muted">{{ content }}</p>
    </div>
    <div class="mt-4 flex justify-between items-center text-muted text-sm">
      <div class="flex items-center gap-2">
        <div>10</div>
        <HeartIcon
          class="w-5 h-5 hover:text-red-500 hover:fill-red-500 cursor-pointer hover:scale-110 transition duration-200"
        />
      </div>
      <div>
        <TrashIcon
          v-if="user.id === currentUser?.id"
          @click="deletePost(id)"
          class="w-5 h-5 hover:text-red-500 cursor-pointer"
        />
      </div>
    </div>
  </div>
</template>
