<script setup lang="ts">
import { HeartIcon, TrashIcon, ChatBubbleBottomCenterIcon } from "@heroicons/vue/24/outline";
import { handleLikePost } from "~/composables/usePost";

const currentUser = useUserStore().getUser;

const props = defineProps({
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
  nbLikes: {
    type: Number,
    required: true,
  },
  isLiked: {
    type: Boolean,
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

const nbLikesRef = ref(props.nbLikes);
const isLikedRef = ref(props.isLiked);

async function handleLike(postId: number) {
  isLikedRef.value = !isLikedRef.value;
  await handleLikePost(postId);
}

watch(
  () => isLikedRef.value,
  (isLiked) => {
    if (isLiked) {
      nbLikesRef.value++;
      isLikedRef.value = true;
    } else {
      nbLikesRef.value--;
      isLikedRef.value = false;
    }
  },
);
</script>

<template>
  <div>
    <div class="flex items-center">
      <img :src="user.avatar" alt="" class="w-12 h-12 rounded-full mr-4" />
      <NuxtLink :to="`/app/profile/${user.id}`">
        <h2 class="text-lg font-semibold text-primary hover:underline">{{ user.firstname }} {{ user.lastname }}</h2>
        <p class="text-sm text-muted">{{ createdAt }}</p>
      </NuxtLink>
    </div>
    <p class="mt-4 text-lg text-muted truncate">
      {{ content }}
    </p>
    <div class="mt-4 flex justify-between items-center text-muted text-sm">
      <div class="flex items-center gap-4">
        <div class="flex items-center gap-1">
          <span>{{ nbLikesRef }}</span>
          <HeartIcon
            :class="{
              'text-red-500 fill-red-500 hover:scale-110': isLikedRef,
              'text-gray-400 hover:scale-110': !isLikedRef,
            }"
            class="w-5 h-5 cursor-pointer transition duration-200 hover:text-red-500"
            @click="handleLike(id)"
          />
        </div>
        <div class="flex items-center gap-1">
          <span>0</span>
          <NuxtLink :to="`/app/post/${id}`">
            <ChatBubbleBottomCenterIcon class="w-5 h-5 cursor-pointer transition duration-200 hover:text-primary" />
          </NuxtLink>
        </div>
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
