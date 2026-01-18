import { Request } from "express";

export type AuthUser = {
  id: number;
  role: "USER" | "ADMIN" | "OWNER";
};

/**
 * user is OPTIONAL at type level
 * (middleware guarantees it at runtime)
 */
export type AuthRequest = Request & {
  user?: AuthUser;
};
