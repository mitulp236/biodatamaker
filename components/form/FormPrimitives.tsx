"use client";

import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import { BiodataFormValues } from "@/lib/schema";

type FieldPath = string;

const baseInput =
  "min-h-11 w-full rounded-xl border border-stone-300 bg-white px-3.5 text-base text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900";

function FieldWrapper({
  label,
  htmlFor,
  hint,
  children,
}: {
  label: string;
  htmlFor?: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5" htmlFor={htmlFor}>
      <span className="text-sm font-medium text-stone-700">{label}</span>
      {children}
      {hint && <span className="text-xs text-stone-400">{hint}</span>}
    </label>
  );
}

export function TextField({
  name,
  label,
  placeholder,
  hint,
  type = "text",
}: {
  name: FieldPath;
  label: string;
  placeholder?: string;
  hint?: string;
  type?: string;
}) {
  const { register } = useFormContext<BiodataFormValues>();
  return (
    <FieldWrapper label={label} htmlFor={name} hint={hint}>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        className={baseInput}
        {...register(name as never)}
      />
    </FieldWrapper>
  );
}

export function TextAreaField({
  name,
  label,
  placeholder,
  hint,
  rows = 3,
}: {
  name: FieldPath;
  label: string;
  placeholder?: string;
  hint?: string;
  rows?: number;
}) {
  const { register } = useFormContext<BiodataFormValues>();
  return (
    <FieldWrapper label={label} htmlFor={name} hint={hint}>
      <textarea
        id={name}
        rows={rows}
        placeholder={placeholder}
        className={`${baseInput} min-h-24 py-2.5`}
        {...register(name as never)}
      />
    </FieldWrapper>
  );
}

export function SelectField({
  name,
  label,
  options,
  hint,
}: {
  name: FieldPath;
  label: string;
  options: readonly string[];
  hint?: string;
}) {
  const { register } = useFormContext<BiodataFormValues>();
  return (
    <FieldWrapper label={label} htmlFor={name} hint={hint}>
      <select id={name} className={baseInput} {...register(name as never)}>
        <option value="">Select…</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </FieldWrapper>
  );
}

/** Comma-separated list stored as a string[] in the schema. */
export function TagsField({
  name,
  label,
  placeholder,
  hint,
}: {
  name: FieldPath;
  label: string;
  placeholder?: string;
  hint?: string;
}) {
  const { control } = useFormContext<BiodataFormValues>();
  return (
    <Controller
      name={name as never}
      control={control}
      render={({ field }) => {
        const arr = Array.isArray(field.value) ? field.value : [];
        return (
          <FieldWrapper label={label} htmlFor={name} hint={hint ?? "Separate with commas"}>
            <input
              id={name}
              type="text"
              placeholder={placeholder}
              className={baseInput}
              defaultValue={arr.join(", ")}
              onBlur={(e) => {
                const value = e.target.value
                  .split(",")
                  .map((s) => s.trim())
                  .filter(Boolean);
                field.onChange(value);
              }}
            />
          </FieldWrapper>
        );
      }}
    />
  );
}

export function RadioPillsField({
  name,
  label,
  options,
}: {
  name: FieldPath;
  label: string;
  options: readonly string[];
}) {
  const { control } = useFormContext<BiodataFormValues>();
  return (
    <Controller
      name={name as never}
      control={control}
      render={({ field }) => (
        <div className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-stone-700">{label}</span>
          <div className="flex flex-wrap gap-2">
            {options.map((o) => {
              const selected = field.value === o;
              return (
                <button
                  key={o}
                  type="button"
                  onClick={() => field.onChange(selected ? "" : o)}
                  className={`min-h-11 rounded-full border px-4 text-sm font-medium transition-colors ${
                    selected
                      ? "border-stone-900 bg-stone-900 text-white"
                      : "border-stone-300 bg-white text-stone-700 hover:border-stone-400"
                  }`}
                >
                  {o}
                </button>
              );
            })}
          </div>
        </div>
      )}
    />
  );
}

export function FieldRow({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>;
}
