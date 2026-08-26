import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
  findAuthenticatedUser,
  findUserForLogin,
} from "./auth.repository.js";

import type { LoginInput } from "./auth.schema.js";

type AccessTokenPayload = {
  userId: string;
  email: string;
  roles: string[];
};

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error(
      "JWT_SECRET_NOT_CONFIGURED",
    );
  }

  return secret;
};

export const loginUser = async (
  input: LoginInput,
) => {
  const email = input.email
    .trim()
    .toLowerCase();

  const user =
    await findUserForLogin(email);

  if (!user) {
    throw new Error(
      "INVALID_CREDENTIALS",
    );
  }

  if (!user.is_active) {
    throw new Error(
      "USER_INACTIVE",
    );
  }

  const passwordMatches =
    await bcrypt.compare(
      input.password,
      user.password_hash,
    );

  if (!passwordMatches) {
    throw new Error(
      "INVALID_CREDENTIALS",
    );
  }

  const authenticatedUser =
    await findAuthenticatedUser(
      user.id,
    );

  if (!authenticatedUser) {
    throw new Error(
      "USER_NOT_FOUND",
    );
  }

  const payload: AccessTokenPayload = {
    userId: user.id,
    email: user.email,
    roles:
      authenticatedUser.roles.map(
        (role) => role.name,
      ),
  };

  const token = jwt.sign(
    payload,
    getJwtSecret(),
    {
      expiresIn: "3h",
    },
  );

  return {
    user: authenticatedUser,
    token,
  };
};

export const getCurrentUser = async (
  userId: string,
) => {
  const user = await findAuthenticatedUser(
    userId,
  );

  if (!user) {
    throw new Error(
      "USER_NOT_FOUND",
    );
  }

  return user;
};