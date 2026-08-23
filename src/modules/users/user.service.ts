import bcrypt from "bcrypt";

import {
  createUserWithRoles,
  deleteUser,
  findUserByEmail,
  findUserById,
  updateUserWithRoles,
} from "./user.repository.js";

import {
  findRolesByIds,
} from "../roles/role.repository.js";

import type {
  CreateUserInput,
  UpdateUserInput,
} from "./user.schema.js";

export const createNewUser = async (
  input: CreateUserInput,
) => {
  const email = input.email.trim().toLowerCase();

  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw new Error("USER_ALREADY_EXISTS");
  }

  const roleIds = [
    ...new Set(input.role_ids),
  ];

  const roles = await findRolesByIds(roleIds);

  if (roles.length !== roleIds.length) {
    throw new Error("INVALID_ROLE_IDS");
  }

  const passwordHash = await bcrypt.hash(
    input.password,
    12,
  );

  const user = await createUserWithRoles(
    input.first_name.trim(),
    input.last_name?.trim() || null,
    email,
    passwordHash,
    roleIds,
  );

  return {
    ...user,
    roles: roles.map((role) => ({
      id: role.id,
      name: role.name,
      description: role.description,
    })),
  };
};

export const updateExistingUser = async (
  userId: string,
  input: UpdateUserInput,
) => {
  const currentUser = await findUserById(userId);

  if (currentUser.length === 0) {
    throw new Error("USER_NOT_FOUND");
  }

  const current = currentUser[0];

  const email = input.email
    ? input.email.trim().toLowerCase()
    : current.email;

  const existingUser = await findUserByEmail(email);

  if (
    existingUser &&
    existingUser.id !== userId
  ) {
    throw new Error("USER_ALREADY_EXISTS");
  }

  const roleIds = input.role_ids
    ? [...new Set(input.role_ids)]
    : currentUser
        .filter(
          (row) => row.role_id !== null,
        )
        .map(
          (row) => row.role_id as string,
        );

  const roles = await findRolesByIds(roleIds);

  if (roles.length !== roleIds.length) {
    throw new Error("INVALID_ROLE_IDS");
  }

  const updatedUser =
    await updateUserWithRoles(
      userId,
      input.first_name?.trim() ??
        current.first_name,
      input.last_name !== undefined
        ? input.last_name?.trim() || null
        : current.last_name,
      email,
      input.is_active ??
        current.is_active,
      roleIds,
    );

  return {
    ...updatedUser,
    roles: roles.map((role) => ({
      id: role.id,
      name: role.name,
      description: role.description,
    })),
  };
};


export const deleteExistingUser = async (
  userId: string,
) => {
  const user = await deleteUser(userId);

  if (!user) {
    throw new Error("USER_NOT_FOUND");
  }

  return user;
};