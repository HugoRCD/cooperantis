interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
  };
}

export async function getPostById(postId: number) {
  const user = useUserStore().getUser;
  const { data, refresh } = await useFetch(`/api/post/${postId}`, {
    method: "POST",
    body: {
      userId: user?.id,
    },
  });
  if (!data) {
    useErrorToast("Failed to fetch post");
  } else {
    return { data, refresh };
  }
}

export async function createPost(postContent: string) {
  const user = useUserStore().getUser;
  const { data, refresh } = await useFetch("/api/post/createPost", {
    method: "POST",
    body: {
      content: postContent,
      userId: user?.id,
    },
  });
  if (!data) {
    useErrorToast("Failed to create post");
  } else {
    return { data, refresh };
  }
}

export async function updatePost(post: Post) {
  const { data } = await useFetch("/api/post", {
    method: "PUT",
    body: JSON.stringify(post),
  });
  if (!data) {
    useErrorToast("Failed to update post");
  } else {
    return data;
  }
}

export async function deletePost(postId: number) {
  const { data } = await useFetch(`/api/post/${postId}`, {
    method: "DELETE",
  });
  if (!data) {
    useErrorToast("Failed to delete post");
  } else {
    return data;
  }
}

export async function handleLikePost(postId: number) {
  const user = useUserStore().getUser;
  const { data } = await useFetch("/api/post/handleLike", {
    method: "POST",
    body: {
      postId,
      userId: user?.id,
    },
  });
  if (!data) {
    useErrorToast("Failed to like post");
  }
}
