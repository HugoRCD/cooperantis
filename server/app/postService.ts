import prisma from "~/server/database/client";

export interface createPostInput {
  content: string;
  userId: number;
}

export interface createCommentInput {
  content: string;
  userId: number;
  postId: number;
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
      comments: {
        include: {
          user: true,
        },
        where: {
          userId: userId,
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  });
  if (!post) throw new Error("Post not found");
  const isLiked = post.likes.some((like) => like.userId === userId);
  const comments = post.comments.map((comment) => {
    return {
      ...comment,
      owner: comment.user.id === userId,
    };
  });
  return {
    ...post,
    isLiked,
    comments,
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
      comments: true,
      _count: {
        select: {
          likes: true,
          comments: true,
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
      comments: true,
      _count: {
        select: {
          likes: true,
          comments: true,
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

export async function createComment(comment: createCommentInput) {
  return prisma.comment.create({
    data: {
      content: comment.content,
      user: {
        connect: {
          id: comment.userId,
        },
      },
      post: {
        connect: {
          id: comment.postId,
        },
      },
    },
  });
}

export async function deleteComment(commentId: number) {
  return prisma.comment.delete({
    where: {
      id: commentId,
    },
  });
}
