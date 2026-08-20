"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AppHeader } from "@/components/layout/AppHeader";
import { useActiveBiodata } from "@/hooks/useActiveBiodata";
import { BiodataModeProvider } from "@/components/form/BiodataModeContext";
import { BiodataFormValues, biodataSchema, defaultBiodataValues } from "@/lib/schema";
import { buildBiodataView } from "@/lib/biodataView";
import { BiodataPreview } from "@/components/preview/BiodataPreview";
import { StepPersonal } from "@/components/form/StepPersonal";
import { StepAstro } from "@/components/form/StepAstro";
import { StepEducation } from "@/components/form/StepEducation";
import { StepFamily } from "@/components/form/StepFamily";
import { StepContact } from "@/components/form/StepContact";
import { StepPhoto } from "@/components/form/StepPhoto";
import { DownloadButton } from "@/components/pdf/DownloadButton";

const STEPS = [
  { key: "personal", label: "Personal", Component: StepPersonal },
  { key: "astro", label: "Astro", Component: StepAstro },
  { key: "education", label: "Education", Component: StepEducation },
  { key: "family", label: "Family", Component: StepFamily },
  { key: "contact", label: "Contact", Component: StepContact },
  { key: "photo", label: "Photo", Component: StepPhoto },
] as const;

export default function FormPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const router = useRouter();
  const id = searchParams.id ?? null;
  const qs = id ? `?id=${id}` : "";
  const { mode, hasHydrated, data: activeData, setData } = useActiveBiodata(id);

  const methods = useForm<BiodataFormValues>({
    resolver: zodResolver(biodataSchema),
    defaultValues: defaultBiodataValues,
    mode: "onChange",
  });

  const resetOnceRef = useRef<string | null>(null);
  useEffect(() => {
    const key = id ?? "local";
    if (hasHydrated && resetOnceRef.current !== key) {
      resetOnceRef.current = key;
      methods.reset(activeData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated, id]);

  useEffect(() => {
    if (hasHydrated && !activeData.meta.templateId) {
      router.replace(`/templates${qs}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHydrated]);

  const [stepIndex, setStepIndex] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const step = STEPS[stepIndex];
  const isLastStep = stepIndex === STEPS.length - 1;

  const liveValues = methods.watch();
  const view = buildBiodataView(liveValues);
  const templateId = activeData.meta.templateId ?? "traditional";

  function persistNow() {
    setData(methods.getValues());
  }

  function handleFormBlur() {
    persistNow();
  }

  function goPrev() {
    setStepIndex((i) => Math.max(0, i - 1));
  }

  function goNext() {
    persistNow();
    setStepIndex((i) => Math.min(STEPS.length - 1, i + 1));
  }

  if (!hasHydrated) {
    return (
      <>
        <AppHeader />
        <div className="flex min-h-[60vh] items-center justify-center text-sm text-stone-400">
          Loading your {mode === "remote" ? "biodata" : "draft"}…
        </div>
      </>
    );
  }

  const StepComponent = step.Component;

  return (
    <BiodataModeProvider value={{ mode, biodataId: id }}>
      <FormProvider {...methods}>
        <AppHeader />
        <div className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6 md:pb-10">
          <div className="mb-6 flex items-center justify-between">
            <Link
              href={`/templates${qs}`}
              onClick={persistNow}
              className="text-sm font-medium text-stone-500 hover:text-stone-900"
            >
              ← Change template
            </Link>
            <button
              type="button"
              onClick={() => setPreviewOpen(true)}
              className="min-h-11 rounded-full border border-stone-300 px-4 text-sm font-medium text-stone-700 md:hidden"
            >
              Preview
            </button>
          </div>

          <ol className="mb-8 flex gap-2 overflow-x-auto">
            {STEPS.map((s, i) => (
              <li key={s.key}>
                <button
                  type="button"
                  onClick={() => {
                    persistNow();
                    setStepIndex(i);
                  }}
                  className={`min-h-9 whitespace-nowrap rounded-full px-3.5 text-xs font-semibold transition-colors ${
                    i === stepIndex
                      ? "bg-stone-900 text-white"
                      : i < stepIndex
                        ? "bg-stone-200 text-stone-700"
                        : "bg-stone-100 text-stone-400"
                  }`}
                >
                  {i + 1}. {s.label}
                </button>
              </li>
            ))}
          </ol>

          <div className="grid grid-cols-1 gap-10 md:grid-cols-[1fr_380px]">
            <form onBlur={handleFormBlur} className="min-w-0">
              <h1 className="mb-5 text-xl font-semibold text-stone-900">{step.label} details</h1>
              <StepComponent />
            </form>

            <div className="hidden md:block">
              <div className="sticky top-20">
                <BiodataPreview view={view} templateId={templateId} />
              </div>
            </div>
          </div>
        </div>

        <div className="fixed inset-x-0 bottom-0 z-30 flex gap-3 border-t border-stone-200 bg-white/95 p-3 backdrop-blur md:hidden">
          <button
            type="button"
            onClick={goPrev}
            disabled={stepIndex === 0}
            className="min-h-14 flex-1 rounded-xl border border-stone-300 text-base font-semibold text-stone-700 disabled:opacity-40"
          >
            Back
          </button>
          {isLastStep ? (
            <DownloadButton view={view} templateId={templateId} fullName={liveValues.personal?.fullName} className="min-h-14 flex-1" />
          ) : (
            <button
              type="button"
              onClick={goNext}
              className="min-h-14 flex-1 rounded-xl bg-stone-900 text-base font-semibold text-white"
            >
              Next
            </button>
          )}
        </div>

        <div className="mx-auto hidden max-w-6xl gap-3 px-4 pb-10 sm:px-6 md:flex md:justify-between">
          <button
            type="button"
            onClick={goPrev}
            disabled={stepIndex === 0}
            className="min-h-14 rounded-xl border border-stone-300 px-8 text-base font-semibold text-stone-700 disabled:opacity-40"
          >
            Back
          </button>
          {isLastStep ? (
            <DownloadButton view={view} templateId={templateId} fullName={liveValues.personal?.fullName} className="px-10" />
          ) : (
            <button
              type="button"
              onClick={goNext}
              className="min-h-14 rounded-xl bg-stone-900 px-10 text-base font-semibold text-white"
            >
              Next
            </button>
          )}
        </div>

        {previewOpen && (
          <div className="fixed inset-0 z-50 flex flex-col bg-white md:hidden">
            <div className="flex h-14 items-center justify-between border-b border-stone-200 px-4">
              <span className="text-sm font-semibold text-stone-900">Preview</span>
              <button
                type="button"
                onClick={() => setPreviewOpen(false)}
                className="min-h-11 min-w-11 text-2xl text-stone-500"
                aria-label="Close preview"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-auto bg-stone-100 p-4">
              <BiodataPreview view={view} templateId={templateId} />
            </div>
          </div>
        )}
      </FormProvider>
    </BiodataModeProvider>
  );
}
