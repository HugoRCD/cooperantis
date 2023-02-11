import prisma from "~/server/database/client";

export function deletePost(userId: number, postId: number) {
  return prisma.post.delete({
    where: {
      id: postId,
    },
  });
}
