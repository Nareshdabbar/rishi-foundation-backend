import { query } from "../../db/query.js";

export type PermissionRow = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export const findAllPermissions = async (): Promise<
  PermissionRow[]
> => {
  const result = await query<PermissionRow>(
    `
      SELECT
        id,
        name,
        description,
        created_at,
        updated_at
      FROM permissions
      ORDER BY id;
    `,
  );

  return result.rows;
};

export const findPermissionById = async (
  id: string,
): Promise<PermissionRow | null> => {
  const result = await query<PermissionRow>(
    `
      SELECT
        id,
        name,
        description,
        created_at,
        updated_at
      FROM permissions
      WHERE id = $1;
    `,
    [id],
  );

  return result.rows[0] ?? null;
};

export const findPermissionByName = async (
  name: string,
): Promise<PermissionRow | null> => {
  const result = await query<PermissionRow>(
    `
      SELECT
        id,
        name,
        description,
        created_at,
        updated_at
      FROM permissions
      WHERE name = $1;
    `,
    [name],
  );

  return result.rows[0] ?? null;
};

export const createPermission = async (
  name: string,
  description: string | null,
): Promise<PermissionRow> => {
  const result = await query<PermissionRow>(
    `
      INSERT INTO permissions (
        name,
        description
      )
      VALUES ($1, $2)
      RETURNING
        id,
        name,
        description,
        created_at,
        updated_at;
    `,
    [name, description],
  );

  return result.rows[0];
};

export const updatePermission = async (
  id: string,
  name: string,
  description: string | null,
): Promise<PermissionRow | null> => {
  const result = await query<PermissionRow>(
    `
      UPDATE permissions
      SET
        name = $1,
        description = $2,
        updated_at = NOW()
      WHERE id = $3
      RETURNING
        id,
        name,
        description,
        created_at,
        updated_at;
    `,
    [name, description, id],
  );

  return result.rows[0] ?? null;
};

export const deletePermission = async (
  id: string,
): Promise<PermissionRow | null> => {
  const result = await query<PermissionRow>(
    `
      DELETE FROM permissions
      WHERE id = $1
      RETURNING
        id,
        name,
        description,
        created_at,
        updated_at;
    `,
    [id],
  );

  return result.rows[0] ?? null;
};


export const findUserPermissions = async (
  userId: string,
): Promise<string[]> => {
  const result = await query<{
    permission_name: string;
  }>(
    `
      SELECT DISTINCT
        p.name AS permission_name
      FROM user_roles ur
      INNER JOIN role_permissions rp
        ON rp.role_id = ur.role_id
      INNER JOIN permissions p
        ON p.id = rp.permission_id
      WHERE ur.user_id = $1
      ORDER BY p.name;
    `,
    [userId],
  );

  return result.rows.map(
    (row) => row.permission_name,
  );
};