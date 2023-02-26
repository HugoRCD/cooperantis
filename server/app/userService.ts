import { Subscription, User } from "@prisma/client";
import prisma, { exclude } from "~/server/database/client";
import bcrypt from "bcrypt";
import { isString } from "@vueuse/core";
import { H3Event } from "h3";
import { Role } from "~/types/Role";
import jwt from "jsonwebtoken";
import { createStripeCustomer, deleteStripeCustomer } from "~/server/app/stripeService";
import { createUserInput, updateUserInput } from "~/server/api/user/user.dto";
import { Plans } from "~/types/Pricing";
import resetPassword from "../api/mailer/templates/reset-password";
import { sendGmail } from "~/server/app/mailerService";

export async function createUser(userData: createUserInput) {
  const password = await bcrypt.hash(userData.password, 10);
  const stripeInfo = await createStripeCustomer(userData);
  const user = await prisma.user.create({
    data: {
      ...userData,
      password,
      stripeCustomerId: stripeInfo.stripeCustomerId,
    },
  });
  await prisma.subscription.create({
    data: {
      userId: user.id,
      name: Plans.TRIAL.name,
      stripeId: stripeInfo.subscription.id,
      stripeStatus: stripeInfo.subscription.status,
      stripePriceId: stripeInfo.subscription.items.data[0].price.id,
      trialEndsAt: stripeInfo.subscription.trial_end,
      endsAt: stripeInfo.subscription.current_period_end,
      lastEventDate: stripeInfo.subscription.current_period_start,
      startDate: stripeInfo.subscription.current_period_start,
    },
  });
  const token = await createEmailVerificationToken(user.id);
  const appDomain = useRuntimeConfig().public.appDomain;
  const url = `${appDomain}/verify-email-${token}`;
  await sendGmail({
    template: resetPassword(user.email, url),
    to: user.email,
    from: useRuntimeConfig().mailerUser,
    subject: "Verify your email",
  });
  return exclude(user, ["password", "authToken", "refreshToken"]);
}

export async function getUserById(userId: number) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  if (!user) throw createError({ statusCode: 404, message: "User not found" });
  return exclude(user, ["password", "authToken", "refreshToken"]);
}

export async function getUserByLogin(login: string) {
  return await prisma.user.findFirst({
    where: {
      OR: [{ email: login }, { username: login }, { phone: login }],
    },
  });
}

export async function getAllUsers() {
  const users = await prisma.user.findMany({
    include: {
      subscription: true,
    },
  });
  return users.map((user: User) => {
    return exclude(user, ["password", "authToken", "refreshToken"]);
  });
}

export async function getUserByAuthToken(authToken: string) {
  const user = await prisma.user.findFirst({
    where: {
      authToken,
    },
    include: {
      subscription: true,
    },
  });
  if (!user) return null;
  return exclude(user, ["password"]);
}

export async function setAuthToken(userId: number) {
  const user = (await getUserById(userId)) as User;
  const authToken = jwt.sign(
    {
      id: user.id,
      role: user.role,
      username: user.username,
      email: user.email,
    },
    useRuntimeConfig().private.authSecret,
    { expiresIn: "7d" },
  );
  const updatedUser = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      authToken,
    },
    include: {
      subscription: true,
    },
  });
  return exclude(updatedUser, ["password", "refreshToken"]);
}

export async function adminCheck(event: H3Event): Promise<boolean> {
  const authToken = getCookie(event, "authToken");
  const hasAuthToken = isString(authToken);
  if (!hasAuthToken) return false;
  const user = await getUserByAuthToken(authToken);
  if (!user) return false;
  return user.role === Role.ADMIN;
}

export async function deleteUser(userId: number) {
  const user = (await getUserById(userId)) as User;
  await deleteStripeCustomer(user.stripeCustomerId as string);
  return await prisma.user.delete({
    where: {
      id: userId,
    },
    select: {
      id: true,
      username: true,
      firstname: true,
      lastname: true,
      email: true,
      role: true,
      authToken: true,
    },
  });
}

export async function updateUser(userId: number, updateUserInput: updateUserInput) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...updateUserInput,
    },
    include: {
      subscription: true,
    },
  });
  return exclude(user, ["password", "authToken", "refreshToken"]);
}

export async function updateStripeCustomerId(data: User): Promise<User> {
  return await prisma.user.update({
    where: { email: data.email },
    data: {
      stripeCustomerId: data.stripeCustomerId,
    },
  });
}

export async function getUserByStripeCustomerId(stripeCustomerId: string) {
  const user = await prisma.user.findFirst({
    where: {
      stripeCustomerId: stripeCustomerId,
    },
  });
  if (!user) throw createError({ statusCode: 404, message: "User not found" });
  return exclude(user, ["password", "authToken", "refreshToken"]);
}

export async function getCurrentSubscription(userId: number): Promise<Subscription | null> {
  const user = (await getUserById(userId)) as User;
  return await prisma.subscription.findFirst({
    where: {
      userId: user.id,
    },
  });
}

export async function getSubscriptionById(stripeId: string) {
  return await prisma.subscription.findFirst({
    where: {
      stripeId: stripeId,
    },
  });
}

export async function createOrUpdateSubscription(data: Subscription) {
  const subName = data.stripePriceId === Plans.TRIAL.priceId ? Plans.TRIAL.name : Plans.PRO.name;
  return await prisma.subscription.upsert({
    where: {
      stripeId: data.stripeId,
    },
    create: {
      userId: data.userId,
      name: subName,
      stripeId: data.stripeId,
      stripeStatus: data.stripeStatus,
      stripePriceId: data.stripePriceId,
      trialEndsAt: data.trialEndsAt,
      endsAt: data.endsAt,
      lastEventDate: data.lastEventDate,
      startDate: data.startDate,
    },
    update: {
      name: subName,
      stripeStatus: data.stripeStatus,
      stripePriceId: data.stripePriceId,
      trialEndsAt: data.trialEndsAt,
      endsAt: data.endsAt,
      lastEventDate: data.lastEventDate,
      startDate: data.startDate,
    },
  });
}

export async function generateToken(id: number) {
  const token = Math.random().toString(36);
  await prisma.resetPassword.upsert({
    where: {
      userId: id,
    },
    create: {
      userId: id,
      token: token,
    },
    update: {
      token: token,
    },
  });
  return token;
}

export async function createPost(postData: createPostInput) {
  return await prisma.post.create({
    data: postData,
  });
}

export async function getUserResetPasswordByToken(token: string ) {
  const user = await prisma.resetPassword.findFirst({
    where: {
      token,
    },
    include: {
      user: true,
    },
  });
  if (!user) return null;
  return user;
}


export async function deleteResetPasswordToken(Id: number) {
  await prisma.resetPassword.delete({
    where: {
      userId: Id,
    },
  });
}

export async function newPassword(userId: number, password: string) {
  const user = (await getUserById(userId)) as User;
  const hashedPassword = await bcrypt.hash(password, 10);
  return await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
    },
  });
}


export async function getPasswordResetByToken(token: string) {
  return await prisma.resetPassword.findFirst({
    where: {
      token: token,
    },
  });
}

export async function createEmailVerificationToken(id: number) {
  const token = Math.random().toString(36);
  await prisma.emailVerification.upsert({
    where: {
      userId: id,
    },
    create: {
      userId: id,
      token,
    },
    update: {
      token,
    },
  });
}

export async function verifyEmailbyToken(token: string) {
  return await prisma.emailVerification.findFirst({
    where: {
      token: token,
    },
  });
}

export async function deleteEmailVerificationToken(token: string) {
  await prisma.emailVerification.delete({
    where: {
      token,
    },
  });
}

export async function updateUserEmailVerification(userid: number) {
  return await prisma.user.update({
    where: {
      id: userid,
    },
    data: {
      isVerified: true,
    },
  });
}
