import { getAllPosts } from "~/server/app/postService";

export default eventHandler(async () => {
  return await getAllPosts();
});
