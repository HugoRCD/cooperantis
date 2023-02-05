import { Subscription, User } from "@prisma/client";
import prisma, { exclude } from "~/server/database/client";
import bcrypt from "bcrypt";
import { isString } from "@vueuse/core";
import { H3Event } from "h3";
import { Role } from "~/types/Role";
import jwt from "jsonwebtoken";
import {
  createStripeCustomer,
  deleteStripeCustomer,
} from "~/server/app/stripeService";

export interface createUserInput {
  username: string;
  firstname: string;
  lastname: string;
  password: string;
  email: string;
  phone: string;
  profilePic?: string;
  role?: number;
  address: string;
  city: string;
  country: string;
  postalCode: string;
  profession: string;
}

export interface updateUserInput {
  username?: string;
  firstname?: string;
  lastname?: string;
  password?: string;
  email?: string;
  phone?: string;
  profilePic?: string;
  role?: number;
  address?: string;
  city?: string;
  country?: string;
  postalCode?: string;
  profession?: string;
  website?: string;
  bio?: string;
  company?: string;
}

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
      stripeId: stripeInfo.subscription.id,
      stripeStatus: stripeInfo.subscription.status,
      stripePriceId: stripeInfo.subscription.items.data[0].price.id,
      trialEndsAt: stripeInfo.subscription.trial_end,
      endsAt: stripeInfo.subscription.current_period_end,
      lastEventDate: stripeInfo.subscription.current_period_start,
      startDate: stripeInfo.subscription.current_period_start,
    },
  });
  return exclude(user, ["password", "authToken", "refreshToken"]);
}

export async function getUserById(userId: number) {
  return await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      username: true,
      firstname: true,
      lastname: true,
      email: true,
      phone: true,
      role: true,
      authToken: true,
    },
  });
}

export async function getUserByLogin(login: string) {
  return await prisma.user.findFirst({
    where: {
      OR: [{ email: login }, { username: login }, { phone: login }],
    },
  });
}

export async function getAllUsers() {
  return await prisma.user.findMany({
    select: {
      Subscription: true,
      id: true,
      username: true,
      firstname: true,
      lastname: true,
      email: true,
      phone: true,
      role: true,
    },
  });
}

export async function getUserByAuthToken(authToken: string) {
  return await prisma.user.findFirst({
    where: {
      authToken,
    },
    select: {
      id: true,
      username: true,
      firstname: true,
      lastname: true,
      email: true,
      phone: true,
      role: true,
      authToken: true,
    },
  });
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
  return await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      authToken,
    },
    select: {
      id: true,
      username: true,
      firstname: true,
      lastname: true,
      email: true,
      phone: true,
      role: true,
      authToken: true,
    },
  });
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

export async function updateUser(
  userId: number,
  updateUserInput: updateUserInput,
) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...updateUserInput,
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
  return await prisma.user.findFirst({
    where: {
      stripeCustomerId: stripeCustomerId,
    },
    select: {
      id: true,
      username: true,
      firstname: true,
      lastname: true,
      email: true,
      role: true,
      authToken: true,
      stripeCustomerId: true,
    },
  });
}

export async function getCurrentSubscription(
  userId: number,
): Promise<Subscription | null> {
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
  return await prisma.subscription.upsert({
    where: {
      stripeId: data.stripeId,
    },
    create: {
      userId: data.userId,
      stripeId: data.stripeId,
      stripeStatus: data.stripeStatus,
      stripePriceId: data.stripePriceId,
      trialEndsAt: data.trialEndsAt,
      endsAt: data.endsAt,
      lastEventDate: data.lastEventDate,
      startDate: data.startDate,
    },
    update: {
      stripeStatus: data.stripeStatus,
      stripePriceId: data.stripePriceId,
      trialEndsAt: data.trialEndsAt,
      endsAt: data.endsAt,
      lastEventDate: data.lastEventDate,
      startDate: data.startDate,
    },
  });
}

export async function generateToken(userId: number) {
  const token = Math.random().toString(36);
  await prisma.resetPassword.create({
    data: {
      token,
      userId
    }
  });
  return token;
}