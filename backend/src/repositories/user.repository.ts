import { prisma } from "../lib/prisma.js";

export async function findUserByEmail(email: string) {
  return prisma.user.findFirst({
    where: {
      email: {
        equals: email.trim(),
        mode: "insensitive",
      },
    },
  });
}

export async function findUserByMobile(mobileNumber: string) {
  return prisma.user.findUnique({
    where: {
      mobileNumber,
    },
  });
}

export async function findUserById(id: string) {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}

export async function createUser(data: {
  name: string;
  mobileNumber: string;
  email: string;
  password: string;
  role: string;
}) {
  return prisma.user.create({
    data: {
      name: data.name,
      mobileNumber: data.mobileNumber,
      email: data.email,
      password: data.password,
      role: data.role as any,
    },
  });
}