"use client";

import { useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { TextField, SelectField, RadioPillsField, FieldRow } from "./FormPrimitives";
import { BiodataFormValues, invocationByReligion, manglikOptions, religionOptions } from "@/lib/schema";

function anyAstroFilled(astro: BiodataFormValues["astro"]): boolean {
  return Object.values(astro).some((v) => (typeof v === "string" ? v.trim().length > 0 : !!v));
}

export function StepAstro() {
  const { watch, control } = useFormContext<BiodataFormValues>();
  const astro = watch("astro");
  const religion = watch("astro.religion");
  const [expanded, setExpanded] = useState(false);
  const computedDefault = (religion && invocationByReligion[religion]) || "";

  useEffect(() => {
    if (anyAstroFilled(astro)) setExpanded(true);
    // Only check once on mount to auto-expand a restored draft.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!expanded) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-stone-300 bg-stone-50 px-6 py-10 text-center">
        <p className="text-sm text-stone-600">
          This section is optional and hidden by default. A meaningful share of people
          prefer a biodata without caste on it.
        </p>
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="min-h-11 rounded-full border border-stone-900 px-5 text-sm font-semibold text-stone-900 hover:bg-stone-900 hover:text-white"
        >
          Add religious &amp; astrological details
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <button
        type="button"
        onClick={() => setExpanded(false)}
        className="self-start text-xs font-medium text-stone-400 hover:text-stone-600"
      >
        Hide this section
      </button>
      <SelectField name="astro.religion" label="Religion" options={religionOptions} />
      <FieldRow>
        <TextField name="astro.caste" label="Caste" />
        <TextField name="astro.subCaste" label="Sub-caste" />
      </FieldRow>
      <TextField name="astro.gotra" label="Gotra" />
      <FieldRow>
        <TextField name="astro.rashi" label="Rashi (Moon Sign)" />
        <TextField name="astro.nakshatra" label="Nakshatra" />
      </FieldRow>
      <RadioPillsField name="astro.manglik" label="Manglik" options={manglikOptions} />
      <FieldRow>
        <TextField name="astro.gan" label="Gan" />
        <TextField name="astro.nadi" label="Nadi" />
      </FieldRow>
      <TextField name="astro.charan" label="Charan" />

      <Controller
        name="meta.invocation"
        control={control}
        render={({ field }) => (
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-stone-700">Header invocation line</span>
            <input
              type="text"
              className="min-h-11 w-full rounded-xl border border-stone-300 bg-white px-3.5 text-base text-stone-900 focus:border-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
              value={field.value ?? computedDefault}
              onChange={(e) => field.onChange(e.target.value)}
            />
            <span className="text-xs text-stone-400">
              {computedDefault
                ? `Defaults to a line for ${religion}. Edit it, or clear it to remove the line entirely.`
                : "Optional line at the top of the biodata, e.g. an invocation or a short phrase."}
            </span>
          </label>
        )}
      />
    </div>
  );
}
