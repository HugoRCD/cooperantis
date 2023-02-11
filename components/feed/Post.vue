<script setup lang="ts">
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
  <div>
    <div class="flex items-center space-x-3">
      <img :src="user.avatar" alt="" class="w-10 h-10 rounded-full" />
      <div class="flex items-center gap-4">
        <p class="text-sm font-medium text-primary truncate">{{ user.firstname }} {{ user.lastname }}</p>
        <span class="text-muted">
          {{ new Date(createdAt).toLocaleDateString() }}
        </span>
      </div>
    </div>
    <div class="mt-2 text-sm text-muted">
      <p>
        {{ content }}
      </p>
    </div>
    <div class="mt-6 flex space-x-8">
      <div class="flex text-sm" v-if="user.id === currentUser?.id">
        <button @click="deletePost(id)" class="font-medium text-red-600 hover:text-red-500">Delete</button>
      </div>
    </div>
  </div>
</template>
