import { H3Event } from "h3";
import { createPost, createPostInput } from "~/server/app/postService";

export default eventHandler(async (event: H3Event) => {
  const body = await readBody(event);
  const post: createPostInput = {
    content: body.content,
    userId: body.userId,
  };
  const newPost = await createPost(post);
  if (!newPost) throw createError({ statusCode: 400, statusMessage: "Post not created" });
  return { statusCode: 200, body: newPost };
});
