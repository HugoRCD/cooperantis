import { H3Event } from "h3";
import {createEmailVerificationToken, verifyEmailbyToken, deleteEmailVerificationToken, updateUserEmailVerification } from "~/server/app/userService";

export default eventHandler(async (event: H3Event) => {
    const body = await readBody(event);
    const token = body.token;
    const user = await verifyEmailbyToken(token);
    if (!user) {
        throw createError({
        statusCode: 400,
        statusMessage: "error",
        });
    }
    await updateUserEmailVerification(user.userId);
    await deleteEmailVerificationToken(token);
    return { statusCode: 200, body: { message: "Email verified" } };
});