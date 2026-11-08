"use client";

import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface FieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  autoComplete?: string;
  placeholder?: string;
  multiline?: boolean;
}

export function Field({ label, name, type = "text", value, onChange, error, autoComplete, placeholder, multiline }: FieldProps) {
  const id = useId();
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const common = {
    id,
    name,
    value,
    placeholder,
    autoComplete,
    "aria-invalid": error ? true : undefined,
    "aria-describedby": error ? `${id}-err` : undefined,
  } as const;

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-heading text-sm font-semibold text-forest">
        {label}
      </label>
      <div className="relative">
        {multiline ? (
          <textarea {...common} rows={5} className="field resize-y" onChange={(e) => onChange(e.target.value)} />
        ) : (
          <input
            {...common}
            type={isPassword && show ? "text" : type}
            className={isPassword ? "field pr-12" : "field"}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? "Hide password" : "Show password"}
            className="absolute right-1.5 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full text-botanical hover:bg-palemint"
          >
            {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
      {error && (
        <p id={`${id}-err`} role="alert" className="mt-1.5 text-sm font-medium text-[#9b3b2f]">
          {error}
        </p>
      )}
    </div>
  );
}
