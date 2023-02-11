import prisma from "~/server/database/client";

export default eventHandler(async () => {
  return await prisma.post.findMany({
    include: {
      User: true,
    },
  });
});
