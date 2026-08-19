import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { env } from "../config/env.js";

import {
  createUser,
  findUserByEmail,
  findUserByMobile,
  findUserById,
} from "../repositories/user.repository.js";

interface RegisterInput {
  name: string;
  mobileNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

interface LoginInput {
  email: string;
  password: string;
}

function createToken(userId: string): string {
  return jwt.sign(
    {
      id: userId,
    },
    env.AUTH_SECRET,
    {
      expiresIn: "7d",
    },
  );
}

export async function registerUser(input: RegisterInput) {
  if (input.password !== input.confirmPassword) {
    throw new Error("Passwords do not match");
  }

  const existingUser = await findUserByEmail(input.email);

  if (existingUser) {
    throw new Error("User with this email already exists");
  }

  const existingMobile = await findUserByMobile(input.mobileNumber);

  if (existingMobile) {
    throw new Error("User with this mobile number already exists");
  }

  const hashedPassword = await bcrypt.hash(
    input.password,
    12,
  );

  const user = await createUser({
    name: input.name,
    mobileNumber: input.mobileNumber,
    email: input.email,
    password: hashedPassword,
    role: input.role,
  });

  const token = createToken(user.id);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      mobileNumber: user.mobileNumber,
      email: user.email,
      role: user.role,
    },
  };
}

export async function loginUser(input: LoginInput) {
  const user = await findUserByEmail(input.email);

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const passwordMatch = await bcrypt.compare(
    input.password,
    user.password,
  );

  if (!passwordMatch) {
    throw new Error("Invalid email or password");
  }

  const token = createToken(user.id);

  return {
    token,
    user: {
      id: user.id,
      name: user.name,
      mobileNumber: user.mobileNumber,
      email: user.email,
      role: user.role,
    },
  };
}

export async function getCurrentUser(userId: string) {
  const user = await findUserById(userId);

  if (!user) {
    throw new Error("User not found");
  }

  return {
    id: user.id,
    name: user.name,
    mobileNumber: user.mobileNumber,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function checkGoogleUser(email: string) {
  const user = await findUserByEmail(email);

  if (!user) {
    return {
      exists: false,
    };
  }

  const token = createToken(user.id);

  return {
    exists: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      mobileNumber: user.mobileNumber,
      email: user.email,
      role: user.role,
    },
  };
}