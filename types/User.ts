import { User as PrismaUser, Subscription } from "@prisma/client";

export type User = PrismaUser & {
  Subscription: Subscription[];
}

export const Professions = ["Doctor", "Dentist", "Nurse", "Pharmacist", "Other"];