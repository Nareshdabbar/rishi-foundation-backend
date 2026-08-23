import {
  assignRoleToUser,
  findUserRoles,
  removeRoleFromUser,
} from "./user-role.repository.js";

import {
  findUserById,
} from "./user.repository.js";

import {
  findRoleById,
} from "../roles/role.repository.js";

export const getUserRoles = async (
  userId: string,
) => {
  const user = await findUserById(userId);

  if (user.length === 0) {
    throw new Error("USER_NOT_FOUND");
  }

  return findUserRoles(userId);
};

export const assignUserRole = async (
  userId: string,
  roleId: string,
) => {
  const user = await findUserById(userId);

  if (user.length === 0) {
    throw new Error("USER_NOT_FOUND");
  }

  const role = await findRoleById(roleId);

  if (!role) {
    throw new Error("ROLE_NOT_FOUND");
  }

  const existingRoles = await findUserRoles(
    userId,
  );

  const alreadyAssigned =
    existingRoles.some(
      (item) => item.role_id === roleId,
    );

  if (alreadyAssigned) {
    throw new Error("ROLE_ALREADY_ASSIGNED");
  }

  const userRole = await assignRoleToUser(
    userId,
    roleId,
  );

  if (!userRole) {
    throw new Error("ROLE_ASSIGNMENT_FAILED");
  }

  return userRole;
};

export const removeUserRole = async (
  userId: string,
  roleId: string,
) => {
  const user = await findUserById(userId);

  if (user.length === 0) {
    throw new Error("USER_NOT_FOUND");
  }

  const role = await findRoleById(roleId);

  if (!role) {
    throw new Error("ROLE_NOT_FOUND");
  }

  const removed = await removeRoleFromUser(
    userId,
    roleId,
  );

  if (!removed) {
    throw new Error("USER_ROLE_NOT_FOUND");
  }

  return {
    user_id: userId,
    role_id: roleId,
  };
};