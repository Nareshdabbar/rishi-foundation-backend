import { query } from "../../db/query.js";

export type RoleRow = {
  id: string;
  name: string;
  description: string | null;
};

export const findAllRoles = async (): Promise<RoleRow[]> => {
  const result = await query<RoleRow>(`
    SELECT id, name, description
    FROM roles
    ORDER BY id;
  `);

  return result.rows;
};

export const findRoleById = async (id: string): Promise<RoleRow | null> => {
  const result = await query<RoleRow>(
    `
      SELECT id, name, description
      FROM roles
      WHERE id = $1;
    `,
    [id],
  );

  return result.rows[0] ?? null;
};

export const findRoleByName = async (name: string): Promise<RoleRow | null> => {
  const result = await query<RoleRow>(
    `
      SELECT id, name, description
      FROM roles
      WHERE name = $1;
    `,
    [name],
  );

  return result.rows[0] ?? null;
};

export const createRole = async (
  name: string,
  description: string | null,
): Promise<RoleRow> => {
  const result = await query<RoleRow>(
    `
      INSERT INTO roles (name, description)
      VALUES ($1, $2)
      RETURNING id, name, description;
    `,
    [name, description],
  );

  return result.rows[0];
};

export const updateRole = async (
  id: string,
  name: string,
  description: string | null,
): Promise<RoleRow | null> => {
  const result = await query<RoleRow>(
    `
      UPDATE roles
      SET
        name = $1,
        description = $2,
        updated_at = NOW()
      WHERE id = $3
      RETURNING id, name, description;
    `,
    [name, description, id],
  );

  return result.rows[0] ?? null;
};

export const deleteRole = async (
  id: string,
): Promise<RoleRow | null> => {
  const result = await query<RoleRow>(
    `
      DELETE FROM roles
      WHERE id = $1
      RETURNING id, name, description;
    `,
    [id],
  );

  return result.rows[0] ?? null;
};


export const findRolesByIds = async (
  roleIds: string[],
): Promise<RoleRow[]> => {
  const result = await query<RoleRow>(
    `
      SELECT
        id,
        name,
        description
      FROM roles
      WHERE id = ANY($1::bigint[])
      ORDER BY id;
    `,
    [roleIds],
  );

  return result.rows;
};