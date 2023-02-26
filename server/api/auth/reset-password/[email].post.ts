import { H3Event } from "h3";
import { generateToken, getUserByLogin } from "~/server/app/userService";
import resetPassword from "~/server/api/mailer/templates/reset-password";
import { sendGmail } from "~/server/app/mailerService";

export default eventHandler(async (event: H3Event) => {
  const userEmail = event.context.params.email;
  const user = await getUserByLogin(userEmail);
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
    template: resetPassword(userEmail, url),
    to: userEmail,
    from: useRuntimeConfig().mailerUser,
    subject: "Reset your password",
  });
  return { statusCode: 200, body: { message: "Email sent" } };
});
