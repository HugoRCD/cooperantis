import { Role } from "~/types/Role";

export default defineNuxtRouteMiddleware(async () => {
  const user = await useUser();

  if (user?.role !== Role.ADMIN) {
    return "/";
  }
});
