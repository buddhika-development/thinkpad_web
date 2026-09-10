"use client";

import { type ComponentProps } from "react";
import { useFormStatus } from "react-dom";

import { Button } from "@/components/ui/Button";

type SubmitButtonProps = ComponentProps<typeof Button> & {
  /** Label shown while the enclosing form action is pending. */
  pendingLabel?: string;
};

/**
 * Submit button that reflects the enclosing `<form>`'s pending state via
 * `useFormStatus`. Works for both server-action forms and `useActionState`.
 */
export function SubmitButton({
  children,
  pendingLabel,
  disabled,
  ...props
}: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending || disabled} {...props}>
      {pending && pendingLabel ? pendingLabel : children}
    </Button>
  );
}
