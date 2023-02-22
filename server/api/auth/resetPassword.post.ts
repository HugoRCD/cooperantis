import { isString } from "@vueuse/core";
import { H3Event } from "h3";
import {getUserResetPasswordbyToken, generateToken, deleteResetPasswordToken, getUserByAuthToken, newPassword} from "~/server/app/userService";

export default eventHandler(async (event: H3Event) => {
    const body = await readBody(event);
    const token = body.token;
    const authToken = getCookie(event, "authToken");
    const hasAuthToken = isString(authToken);
    if (!hasAuthToken) return false;
    const user = await getUserByAuthToken(authToken);
    if (!user) {
        throw createError({
        statusCode: 400,
        statusMessage: "error",
        });
    }
    await newPassword(user.id, body.password);
    await deleteResetPasswordToken(user.id);
    return { statusCode: 200, body: { message: "Password change", token } };
    }
);