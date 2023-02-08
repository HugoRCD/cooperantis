import { H3Event } from "h3";
import { generateToken, getUserByLogin } from "~/server/app/userService";
import resetPassword from "~/server/api/mailer/templates/reset-password";
import { sendGmail } from "~/server/app/mailerService";

export default eventHandler(async (event: H3Event) => {
  const body = await readBody(event);
  const email = body.email;
  const user = await getUserByLogin(email);
  if (!user) {
    throw createError({
      statusCode: 400,
      statusMessage: "User not found",
    });
  }
  const token = await generateToken(user.id);
  const appDomain = useRuntimeConfig().public.appDomain;
  const url = `${appDomain}/reset-password-${token}`;
  await sendGmail({
    template: resetPassword(email, url),
    to: email,
    from: useRuntimeConfig().mailerUser,
    subject: "Reset your password",
  });
  return { statusCode: 200, body: { message: "Email sent" } };
});
