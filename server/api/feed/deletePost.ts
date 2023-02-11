import { H3Event } from "h3";
import { deletePost } from "~/server/app/postService";

export default eventHandler(async (event: H3Event) => {
  const userId = parseInt(event.context.params.userId);
  const body = await readBody(event);
  const postId = parseInt(body.postId);
  return await deletePost(userId, postId);
});
