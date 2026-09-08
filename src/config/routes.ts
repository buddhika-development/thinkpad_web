/**
 * Central route map. Reference routes through this object instead of
 * hardcoding path strings, so link targets stay consistent and refactorable.
 */
export const routes = {
  home: "/",
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
  /** OAuth redirect target — exchanges the provider code for a session. */
  callback: "/callback",
} as const;

export type RouteKey = keyof typeof routes;
