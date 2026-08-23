import {
  createRole,
  findRoleById,
  findRoleByName,
  findAllRoles,
  updateRole,
  deleteRole,
} from "./role.repository.js";

export const getAllRoles = async () => {
  return findAllRoles();
};

export const getRoleById = async (id: string) => {
  return findRoleById(id);
};

export const createNewRole = async (
  name: string,
  description: string | null,
) => {
  const existingRole = await findRoleByName(name);

  if (existingRole) {
    throw new Error("ROLE_ALREADY_EXISTS");
  }

  return createRole(name, description);
};




export const updateExistingRole = async (
  id: string,
  name: string,
  description: string | null,
) => {
  const existingRole = await findRoleById(id);

  if (!existingRole) {
    throw new Error("ROLE_NOT_FOUND");
  }

  const roleWithSameName = await findRoleByName(name);

  if (roleWithSameName && roleWithSameName.id !== id) {
    throw new Error("ROLE_ALREADY_EXISTS");
  }

  return updateRole(id, name, description);
};

export const deleteExistingRole = async (id: string) => {
  const existingRole = await findRoleById(id);

  if (!existingRole) {
    throw new Error("ROLE_NOT_FOUND");
  }

  return deleteRole(id);
};