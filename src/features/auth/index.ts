/**
 * Public surface of the `auth` feature.
 *
 * Anything outside this feature must import from here — never reach into
 * `auth/components`, `auth/hooks`, or `auth/api` directly. Keeping the
 * public API in one barrel is what lets the internals be refactored freely.
 */
export { getCurrentUser } from "./api/get-user";
export { AuthCard } from "./components/AuthCard";
export { AuthProvider } from "./components/AuthProvider";
export { LoginForm } from "./components/LoginForm";
export { OAuthButtons } from "./components/OAuthButtons";
export { RegisterForm } from "./components/RegisterForm";
export { UserMenu } from "./components/UserMenu";
export { useSession } from "./hooks/useSession";
