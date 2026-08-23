import {
  createPermission,
  deletePermission,
  findAllPermissions,
  findPermissionById,
  findPermissionByName,
  findUserPermissions,
  updatePermission,
} from "./permission.repository.js";

import type {
  CreatePermissionInput,
  UpdatePermissionInput,
} from "./permission.schema.js";

export const getAllPermissions = async () => {
  return findAllPermissions();
};

export const getPermission = async (
  id: string,
) => {
  return findPermissionById(id);
};

export const createNewPermission = async (
  input: CreatePermissionInput,
) => {
  const name = input.name.trim();

  const existingPermission =
    await findPermissionByName(name);

  if (existingPermission) {
    throw new Error(
      "PERMISSION_ALREADY_EXISTS",
    );
  }

  return createPermission(
    name,
    input.description?.trim() || null,
  );
};

export const updateExistingPermission =
  async (
    id: string,
    input: UpdatePermissionInput,
  ) => {
    const existingPermission =
      await findPermissionById(id);

    if (!existingPermission) {
      throw new Error(
        "PERMISSION_NOT_FOUND",
      );
    }

    const name = input.name.trim();

    const duplicate =
      await findPermissionByName(name);

    if (
      duplicate &&
      duplicate.id !== id
    ) {
      throw new Error(
        "PERMISSION_ALREADY_EXISTS",
      );
    }

    return updatePermission(
      id,
      name,
      input.description?.trim() || null,
    );
  };

export const deleteExistingPermission =
  async (id: string) => {
    const permission =
      await deletePermission(id);

    if (!permission) {
      throw new Error(
        "PERMISSION_NOT_FOUND",
      );
    }

    return permission;
  };


  export const getUserPermissions = async (
  userId: string,
): Promise<string[]> => {
  return findUserPermissions(userId);
};