import { getPostById } from "~/server/app/postService";
import { H3Event } from "h3";

export default eventHandler(async (event: H3Event) => {
  const body = await readBody(event);
  const postId = parseInt(event.context.params.postId);
  const userId = parseInt(body.userId);
  return await getPostById(postId, userId);
});
