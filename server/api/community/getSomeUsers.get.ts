import { getSomeUsers } from "~/server/api/community/services/communityService";

export default eventHandler(async () => {
  return await getSomeUsers();
});
