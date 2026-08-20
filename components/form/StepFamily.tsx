"use client";

import { useFieldArray, useFormContext } from "react-hook-form";
import { TextField, SelectField, TextAreaField, FieldRow } from "./FormPrimitives";
import { BiodataFormValues, familyTypeOptions, familyValuesOptions, maritalStatusOptions } from "@/lib/schema";

function SiblingRepeater({ name, label }: { name: "family.brothers" | "family.sisters"; label: string }) {
  const { control, register } = useFormContext<BiodataFormValues>();
  const { fields, append, remove } = useFieldArray({ control, name });

  return (
    <div className="flex flex-col gap-3">
      <span className="text-sm font-medium text-stone-700">{label}</span>
      {fields.map((f, i) => (
        <div key={f.id} className="rounded-xl border border-stone-200 bg-stone-50 p-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <input
              placeholder="Name (optional)"
              className="min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-base"
              {...register(`${name}.${i}.name` as const)}
            />
            <select
              className="min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-base"
              {...register(`${name}.${i}.maritalStatus` as const)}
            >
              <option value="">Marital status…</option>
              {maritalStatusOptions.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
            <input
              placeholder="Occupation (optional)"
              className="min-h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-base"
              {...register(`${name}.${i}.occupation` as const)}
            />
          </div>
          <button
            type="button"
            onClick={() => remove(i)}
            className="mt-2 min-h-9 text-xs font-medium text-red-700 hover:underline"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ name: "", maritalStatus: "", occupation: "" })}
        className="min-h-11 self-start rounded-full border border-stone-300 px-4 text-sm font-medium text-stone-700 hover:border-stone-900"
      >
        + Add {label.toLowerCase().slice(0, -1)}
      </button>
    </div>
  );
}

export function StepFamily() {
  return (
    <div className="flex flex-col gap-5">
      <FieldRow>
        <TextField name="family.fatherName" label="Father's Name" />
        <TextField name="family.fatherOccupation" label="Father's Occupation" />
      </FieldRow>
      <FieldRow>
        <TextField name="family.motherName" label="Mother's Name" />
        <TextField name="family.motherOccupation" label="Mother's Occupation" />
      </FieldRow>

      <SiblingRepeater name="family.brothers" label="Brothers" />
      <SiblingRepeater name="family.sisters" label="Sisters" />

      <FieldRow>
        <SelectField name="family.familyType" label="Family Type" options={familyTypeOptions} />
        <SelectField name="family.familyValues" label="Family Values" options={familyValuesOptions} />
      </FieldRow>
      <TextField name="family.nativePlace" label="Native Place" />
      <TextAreaField name="family.familyBackground" label="Family Background" placeholder="Any other family details" />
    </div>
  );
}
