import { pool } from "../../db/database.js";
import { query } from "../../db/query.js";

export type UserRow = {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type UserWithRoleRow = UserRow & {
  role_id: string | null;
  role_name: string | null;
  role_description: string | null;
};

export const findUserByEmail = async (
  email: string,
): Promise<UserRow | null> => {
  const result = await query<UserRow>(
    `
      SELECT
        id,
        first_name,
        last_name,
        email,
        is_active,
        created_at,
        updated_at
      FROM users
      WHERE email = $1;
    `,
    [email],
  );

  return result.rows[0] ?? null;
};

export const findUserById = async (
  id: string,
): Promise<UserWithRoleRow[]> => {
  const result = await query<UserWithRoleRow>(
    `
      SELECT
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.is_active,
        u.created_at,
        u.updated_at,
        r.id AS role_id,
        r.name AS role_name,
        r.description AS role_description
      FROM users u
      LEFT JOIN user_roles ur
        ON ur.user_id = u.id
      LEFT JOIN roles r
        ON r.id = ur.role_id
      WHERE u.id = $1
      ORDER BY r.id;
    `,
    [id],
  );

  return result.rows;
};

export const findAllUsers = async (): Promise<
  UserWithRoleRow[]
> => {
  const result = await query<UserWithRoleRow>(
    `
      SELECT
        u.id,
        u.first_name,
        u.last_name,
        u.email,
        u.is_active,
        u.created_at,
        u.updated_at,
        r.id AS role_id,
        r.name AS role_name,
        r.description AS role_description
      FROM users u
      LEFT JOIN user_roles ur
        ON ur.user_id = u.id
      LEFT JOIN roles r
        ON r.id = ur.role_id
      ORDER BY u.id;
    `,
  );

  return result.rows;
};


export type CreatedUser = {
  id: string;
  first_name: string;
  last_name: string | null;
  email: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export const createUserWithRoles = async (
  firstName: string,
  lastName: string | null,
  email: string,
  passwordHash: string,
  roleIds: string[],
): Promise<CreatedUser> => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const userResult = await client.query<CreatedUser>(
      `
        INSERT INTO users (
          first_name,
          last_name,
          email,
          password_hash,
          is_active
        )
        VALUES ($1, $2, $3, $4, true)
        RETURNING
          id,
          first_name,
          last_name,
          email,
          is_active,
          created_at,
          updated_at;
      `,
      [
        firstName,
        lastName,
        email,
        passwordHash,
      ],
    );

    const user = userResult.rows[0];

    for (const roleId of roleIds) {
      await client.query(
        `
          INSERT INTO user_roles (
            user_id,
            role_id
          )
          VALUES ($1, $2);
        `,
        [user.id, roleId],
      );
    }

    await client.query("COMMIT");

    return user;
  } catch (error) {
    await client.query("ROLLBACK");

    throw error;
  } finally {
    client.release();
  }
};



export const updateUserWithRoles = async (
  userId: string,
  firstName: string,
  lastName: string | null,
  email: string,
  isActive: boolean,
  roleIds: string[],
): Promise<CreatedUser> => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const userResult = await client.query<CreatedUser>(
      `
        UPDATE users
        SET
          first_name = $1,
          last_name = $2,
          email = $3,
          is_active = $4,
          updated_at = NOW()
        WHERE id = $5
        RETURNING
          id,
          first_name,
          last_name,
          email,
          is_active,
          created_at,
          updated_at;
      `,
      [
        firstName,
        lastName,
        email,
        isActive,
        userId,
      ],
    );

    const user = userResult.rows[0];

    if (!user) {
      throw new Error("USER_NOT_FOUND");
    }

    await client.query(
      `
        DELETE FROM user_roles
        WHERE user_id = $1;
      `,
      [userId],
    );

    for (const roleId of roleIds) {
      await client.query(
        `
          INSERT INTO user_roles (
            user_id,
            role_id
          )
          VALUES ($1, $2);
        `,
        [userId, roleId],
      );
    }

    await client.query("COMMIT");

    return user;
  } catch (error) {
    await client.query("ROLLBACK");

    throw error;
  } finally {
    client.release();
  }
};


export const deleteUser = async (
  userId: string,
): Promise<CreatedUser | null> => {
  const result = await query<CreatedUser>(
    `
      DELETE FROM users
      WHERE id = $1
      RETURNING
        id,
        first_name,
        last_name,
        email,
        is_active,
        created_at,
        updated_at;
    `,
    [userId],
  );

  return result.rows[0] ?? null;
};