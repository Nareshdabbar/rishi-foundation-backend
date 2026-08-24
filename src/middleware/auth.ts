import type { NextFunction, Request, Response } from "express";

import jwt, { type JwtPayload } from "jsonwebtoken";

export type AuthenticatedUser = {
  id: string;
  email: string;
  roles: string[];
};

export type AuthenticatedRequest = Request & {
  user?: AuthenticatedUser;
};

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET_NOT_CONFIGURED");
  }

  return secret;
};

export const requireAuth = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies?.rishi_admin_token;

    if (!token) {
      res.status(401).json({
        success: false,
        message: "Authentication required.",
      });

      return;
    }

    const decoded = jwt.verify(token, getJwtSecret());

    if (typeof decoded !== "object" || decoded === null) {
      res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });

      return;
    }

    const payload = decoded as JwtPayload & {
      userId?: unknown;
      email?: unknown;
      roles?: unknown;
    };

    if (
      typeof payload.userId !== "string" ||
      typeof payload.email !== "string"
    ) {
      res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });

      return;
    }

    const roles = Array.isArray(payload.roles)
      ? payload.roles.filter((role): role is string => typeof role === "string")
      : [];

    const authenticatedRequest = req as AuthenticatedRequest;

    authenticatedRequest.user = {
      id: payload.userId,
      email: payload.email,
      roles,
    };

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({
        success: false,
        message: "Authentication token has expired.",
      });

      return;
    }

    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        message: "Invalid authentication token.",
      });

      return;
    }

    if (
      error instanceof Error &&
      error.message === "JWT_SECRET_NOT_CONFIGURED"
    ) {
      console.error("JWT_SECRET is not configured.");

      res.status(500).json({
        success: false,
        message: "Authentication service is not configured.",
      });

      return;
    }

    console.error("Authentication middleware failed:", error);

    res.status(500).json({
      success: false,
      message: "Authentication failed.",
    });
  }
};
