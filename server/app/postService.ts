import prisma from "~/server/database/client";

export interface createPostInput {
  content: string;
  userId: number;
}

export async function createPost(post: createPostInput) {
  return prisma.post.create({
    data: {
      content: post.content,
      user: {
        connect: {
          id: post.userId,
        },
      },
    },
  });
}

export async function deletePost(userId: number, postId: number) {
  return prisma.post.delete({
    where: {
      id: postId,
    },
  });
}

export async function getPostById(postId: number, userId: number) {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      user: true,
      likes: true,
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });
  if (!post) throw new Error("Post not found");
  return {
    ...post,
    isLiked: post.likes.some((like) => like.userId === userId),
  };
}

export async function getPostsByUserId(userId: number) {
  const post = await prisma.post.findMany({
    where: {
      userId: userId,
    },
    include: {
      user: true,
      likes: true,
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });

  return post.map((post) => {
    return {
      ...post,
      isLiked: post.likes.some((like) => like.userId === userId),
    };
  });
}

export async function getAllPosts(userId: number) {
  const posts = await prisma.post.findMany({
    include: {
      user: true,
      likes: true,
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });
  return posts.map((post) => {
    return {
      ...post,
      isLiked: post.likes.some((like) => like.userId === userId),
    };
  });
}

export async function handleLikePost(userId: number, postId: number) {
  const post = await getPostById(postId, userId);
  if (!post) throw new Error("Post not found");
  const isLiked = post.likes.some((like) => like.userId === userId);
  if (isLiked) {
    return prisma.like.delete({
      where: {
        id: post.likes.find((like) => like.userId === userId)?.id,
      },
    });
  } else {
    return prisma.like.create({
      data: {
        user: {
          connect: {
            id: userId,
          },
        },
        post: {
          connect: {
            id: postId,
          },
        },
      },
    });
  }
}
