import { query } from "../../db/query.js";

export type AuthUserRow = {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  password_hash: string;
  is_active: boolean;
};

type AuthenticatedUserRow = {
  id: string;
  email: string;
  role_id: string | null;
  role_name: string | null;
  role_description: string | null;
  permission_name: string | null;
};

export type AuthenticatedUser = {
  id: string;
  email: string;
  roles: {
    id: string;
    name: string;
    description: string | null;
  }[];
  permissions: string[];
};

export const findUserForLogin = async (
  email: string,
): Promise<AuthUserRow | null> => {
  const result = await query<AuthUserRow>(
    `
      SELECT
        id,
        first_name,
        last_name,
        email,
        password_hash,
        is_active
      FROM users
      WHERE email = $1;
    `,
    [email],
  );

  return result.rows[0] ?? null;
};

export const findAuthenticatedUser = async (
  userId: string,
): Promise<AuthenticatedUser | null> => {
  const result = await query<AuthenticatedUserRow>(
    `
      SELECT DISTINCT
        u.id,
        u.email,
        r.id AS role_id,
        r.name AS role_name,
        r.description AS role_description,
        p.name AS permission_name
      FROM users u
      LEFT JOIN user_roles ur
        ON ur.user_id = u.id
      LEFT JOIN roles r
        ON r.id = ur.role_id
      LEFT JOIN role_permissions rp
        ON rp.role_id = r.id
      LEFT JOIN permissions p
        ON p.id = rp.permission_id
      WHERE u.id = $1
        AND u.is_active = true;
    `,
    [userId],
  );

  if (result.rows.length === 0) {
    return null;
  }

  const rows = result.rows;

  const first = rows[0];

  const roles: AuthenticatedUser["roles"] = rows
    .filter((row) => row.role_id !== null)
    .map((row) => ({
      id: row.role_id as string,
      name: row.role_name as string,
      description: row.role_description,
    }));

  const uniqueRoles = Array.from(
    new Map(roles.map((role) => [role.id, role])).values(),
  );

  const permissions: string[] = Array.from(
    new Set(
      rows
        .map((row) => row.permission_name)
        .filter((permission): permission is string => permission !== null),
    ),
  );

  return {
    id: first.id,
    email: first.email,
    roles: uniqueRoles,
    permissions,
  };
};
