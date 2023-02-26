import prisma from "~/server/database/client";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import { getUserById } from "~/server/app/userService";

export async function updatePassword(userId: number, password: string) {
  const user = (await getUserById(userId)) as User;
  const hashedPassword = await bcrypt.hash(password, 10);
  const updatedUser = await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      password: hashedPassword,
    },
  });
  await prisma.resetPassword.delete({
    where: {
      userId: updatedUser.id,
    },
  });
  return updatedUser;
}

export async function getUserIdByToken(token: string) {
  const user = await prisma.resetPassword.findFirst({
    where: {
      token,
    },
  });
  if (!user) return null;
  return user.userId;
}
