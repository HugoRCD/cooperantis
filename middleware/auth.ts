export default defineNuxtRouteMiddleware(async () => {
  const user = await useUser();
  if (user == null && user == undefined || !user) {
    console.log("User is not logged in");
    return "/login";
  }
});
