import { signInWithOAuth } from "../api/auth-actions";
import { FacebookIcon } from "./FacebookIcon";
import { GoogleIcon } from "./GoogleIcon";
import { SubmitButton } from "./SubmitButton";

const PROVIDERS = [
  { id: "google", label: "Continue with Google", Icon: GoogleIcon },
  { id: "facebook", label: "Continue with Facebook", Icon: FacebookIcon },
] as const;

/**
 * One form per OAuth provider. Each submits to the `signInWithOAuth` server
 * action, which redirects to the provider and back through `/callback`.
 */
export function OAuthButtons() {
  return (
    <div className="flex flex-col gap-3">
      {PROVIDERS.map(({ id, label, Icon }) => (
        <form key={id} action={signInWithOAuth}>
          <input type="hidden" name="provider" value={id} />
          <SubmitButton variant="outline" className="w-full">
            <Icon />
            {label}
          </SubmitButton>
        </form>
      ))}
    </div>
  );
}
