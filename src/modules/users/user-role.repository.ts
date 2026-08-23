import { query } from "../../db/query.js";

export type UserRoleRow = {
  user_id: string;
  role_id: string;
  role_name: string;
  role_description: string | null;
  created_at: string;
};

export const findUserRoles = async (
  userId: string,
): Promise<UserRoleRow[]> => {
  const result = await query<UserRoleRow>(
    `
      SELECT
        ur.user_id,
        ur.role_id,
        r.name AS role_name,
        r.description AS role_description,
        ur.created_at
      FROM user_roles ur
      INNER JOIN roles r
        ON r.id = ur.role_id
      WHERE ur.user_id = $1
      ORDER BY r.id;
    `,
    [userId],
  );

  return result.rows;
};

export const assignRoleToUser = async (
  userId: string,
  roleId: string,
): Promise<UserRoleRow> => {
  const result = await query<UserRoleRow>(
    `
      INSERT INTO user_roles (
        user_id,
        role_id
      )
      SELECT
        $1,
        $2
      WHERE EXISTS (
        SELECT 1
        FROM users
        WHERE id = $1
      )
      AND EXISTS (
        SELECT 1
        FROM roles
        WHERE id = $2
      )
      ON CONFLICT (user_id, role_id)
      DO NOTHING
      RETURNING
        user_id,
        role_id,
        (
          SELECT name
          FROM roles
          WHERE id = $2
        ) AS role_name,
        (
          SELECT description
          FROM roles
          WHERE id = $2
        ) AS role_description,
        created_at;
    `,
    [userId, roleId],
  );

  return result.rows[0] ?? null;
};

export const removeRoleFromUser = async (
  userId: string,
  roleId: string,
): Promise<boolean> => {
  const result = await query(
    `
      DELETE FROM user_roles
      WHERE user_id = $1
        AND role_id = $2;
    `,
    [userId, roleId],
  );

  return (result.rowCount ?? 0) > 0;
};