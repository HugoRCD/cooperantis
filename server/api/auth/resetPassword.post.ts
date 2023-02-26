import { H3Event } from "h3";
import { deleteResetPasswordToken, getPasswordResetByToken, newPassword } from "~/server/app/userService";

export default eventHandler(async (event: H3Event) => {
  const body = await readBody(event);
  const token = body.token;
  const user = await getPasswordResetByToken(token);
  if (!user) {
    throw createError({
      statusCode: 400,
      statusMessage: "error",
    });
  }
  await newPassword(user.userId, body.password);
  await deleteResetPasswordToken(user.userId);
  return { statusCode: 200, body: { message: "Password change", token } };
});
