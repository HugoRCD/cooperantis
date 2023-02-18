import { deleteComment } from "~/server/app/postService";
import { H3Event } from "h3";

export default eventHandler(async (event: H3Event) => {
  const postId = parseInt(event.context.params.postId);
  return await deleteComment(postId);
});
