import { H3Event } from "h3";
import { generateToken, getUserByLogin } from "~/server/app/userService";

export default eventHandler(async (event: H3Event) => {
    const body = await readBody(event);
    const email = body.email;
    const user = await getUserByLogin(email);
    if (!user) {
      sendError(event, createError({ statusCode: 401, statusMessage: "User not found" }));
      return;
    }
    const token = await generateToken(user.id);
    const appDomain = useRuntimeConfig().public.appDomain;
    const url =  `${appDomain}/reset-password-${token}`;
    return token;
});