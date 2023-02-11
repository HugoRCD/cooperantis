import prisma from "~/server/database/client";

export interface createPostInput {
  content: string;
  userId: number;
}

export async function createPost(post: createPostInput) {
  return prisma.post.create({
    data: {
      content: post.content,
      User: {
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

export async function getPostById(postId: number) {
  return prisma.post.findFirst({
    where: {
      id: postId,
    },
  });
}

export async function getPostsByUserId(userId: number) {
  return prisma.post.findMany({
    where: {
      userId: userId,
    },
  });
}

export async function getAllPosts() {
  return prisma.post.findMany({
    include: {
      User: true,
    },
  });
}
