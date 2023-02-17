import { getAllPosts } from "~/server/app/postService";
import { H3Event } from "h3";

export default eventHandler(async (event: H3Event) => {
  const body = await readBody(event);
  const userId = parseInt(body.userId);
  return await getAllPosts(userId);
});
