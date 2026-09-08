import type { ComponentProps } from "react";

import { Input } from "@/components/ui/Input";

type FieldProps = ComponentProps<"input"> & {
  label: string;
  /** Validation messages to show beneath the input. */
  errors?: string[];
};

/**
 * Labelled form field: label + input + optional error text. Domain-agnostic,
 * so it lives in composites. The input's `id` defaults to its `name` for the
 * label association.
 */
export function Field({ label, errors, id, name, ...props }: FieldProps) {
  const fieldId = id ?? name;
  return (
    <div className="flex flex-col gap-1.5 text-left">
      <label htmlFor={fieldId} className="text-sm font-medium">
        {label}
      </label>
      <Input id={fieldId} name={name} {...props} />
      {errors?.map((error) => (
        <p key={error} className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      ))}
    </div>
  );
}
