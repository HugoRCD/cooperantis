import { H3Event } from "h3";
import { handleLikePost } from "~/server/app/postService";

export default eventHandler(async (event: H3Event) => {
  const body = await readBody(event);
  const postId = parseInt(body.postId);
  const userId = parseInt(body.userId);
  return await handleLikePost(userId, postId);
});
