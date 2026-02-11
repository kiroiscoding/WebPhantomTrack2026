import type { User } from "@supabase/supabase-js";

export type AdminRole = "admin" | "staff";

export function isAdminEmail(email?: string | null) {
  const allow = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  if (!email) return false;
  return allow.includes(email.toLowerCase());
}

export function getUserRole(user?: User | null): AdminRole | null {
  const meta = (user?.app_metadata ?? {}) as Record<string, unknown>;
  const role = meta.role;
  if (role === "admin" || role === "staff") return role;

  const roles = meta.roles;
  if (Array.isArray(roles)) {
    if (roles.some((r) => r === "admin")) return "admin";
    if (roles.some((r) => r === "staff")) return "staff";
  }

  return null;
}/** Admin dashboard access: admin OR staff (fallback: ADMIN_EMAILS allowlist). */
export function userHasAdminAccess(user?: User | null) {
  const role = getUserRole(user);
  if (role === "admin" || role === "staff") return true;
  return isAdminEmail(user?.email);
}

/** Elevated access (role=admin) (fallback: ADMIN_EMAILS allowlist). */
export function userIsAdmin(user?: User | null) {
  const role = getUserRole(user);
  if (role === "admin") return true;
  return isAdminEmail(user?.email);
}
