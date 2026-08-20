"use client";

import { useRouter } from "next/navigation";
import { AppHeader } from "@/components/layout/AppHeader";
import { useActiveBiodata } from "@/hooks/useActiveBiodata";
import { buildBiodataView, BiodataView } from "@/lib/biodataView";
import { BiodataPreview } from "@/components/preview/BiodataPreview";
import { TemplateId } from "@/lib/schema";

const TEMPLATES: { id: TemplateId; name: string; blurb: string }[] = [
  { id: "traditional", name: "Traditional", blurb: "Maroon & gold, ornate border. Highest density." },
  { id: "modern", name: "Modern Minimal", blurb: "Two-column, teal accent. Most breathing room." },
  { id: "botanical", name: "Elegant Floral", blurb: "Ivory & rose, botanical corners. Warm and soft." },
];

const SAMPLE_VIEW: BiodataView = {
  name: "Ananya Raghunathan",
  invocation: "|| Shree Ganeshaya Namah ||",
  photo: null,
  secondaryPhotos: [],
  quickFacts: [
    { label: "Height", value: "5 ft 5 in (165 cm)" },
    { label: "Religion", value: "Hindu" },
    { label: "Qualification", value: "M.Tech, Software Engineer" },
    { label: "Location", value: "Bengaluru, Karnataka" },
  ],
  sections: [
    {
      title: "Personal Details",
      fields: [
        { label: "Date of Birth", value: "14 June 1996" },
        { label: "Time of Birth", value: "6:45 AM" },
        { label: "Place of Birth", value: "Coimbatore, Tamil Nadu" },
        { label: "Age", value: "30" },
        { label: "Height", value: "5 ft 5 in (165 cm)" },
        { label: "Weight", value: "58 kg" },
        { label: "Complexion", value: "Fair" },
        { label: "Blood Group", value: "B+" },
        { label: "Marital Status", value: "Never Married" },
        { label: "Diet", value: "Veg" },
        { label: "Languages Known", value: "Tamil, English, Hindi" },
        { label: "Hobbies", value: "Classical dance, reading, gardening" },
      ],
    },
    {
      title: "Religious & Astrological",
      fields: [
        { label: "Religion", value: "Hindu" },
        { label: "Caste", value: "Iyer" },
        { label: "Gotra", value: "Bharadwaja" },
        { label: "Rashi", value: "Kanya (Virgo)" },
        { label: "Nakshatra", value: "Chitra" },
        { label: "Manglik", value: "No" },
      ],
    },
    {
      title: "Education & Career",
      fields: [
        { label: "Highest Qualification", value: "M.Tech, Computer Science" },
        { label: "Institution", value: "IIT Madras" },
        { label: "Occupation", value: "Software Engineer" },
        { label: "Organization", value: "Infosys Ltd., Bengaluru" },
        { label: "Annual Income", value: "₹18,00,000 per annum" },
        { label: "Work Location", value: "Bengaluru, Karnataka" },
      ],
    },
    {
      title: "Family Details",
      fields: [
        { label: "Father's Name", value: "Mr. R. Raghunathan" },
        { label: "Father's Occupation", value: "Retired Bank Manager" },
        { label: "Mother's Name", value: "Mrs. Kavitha Raghunathan" },
        { label: "Mother's Occupation", value: "Homemaker" },
        { label: "Brothers", value: "Elder brother — Married, Business" },
        { label: "Sisters", value: "Younger sister — Never Married, Student" },
        { label: "Family Type", value: "Nuclear" },
        { label: "Native Place", value: "Thanjavur, Tamil Nadu" },
      ],
    },
    {
      title: "Contact",
      fields: [
        { label: "Address", value: "12 Gandhi Street, R.S. Puram, Coimbatore 641002" },
        { label: "Phone", value: "+91 98765 43210" },
        { label: "Email", value: "ananya.r@example.com" },
        { label: "Contact Person", value: "Mr. R. Raghunathan (Father)" },
      ],
    },
  ],
};

export default function TemplateSelectPage({
  searchParams,
}: {
  searchParams: { id?: string };
}) {
  const router = useRouter();
  const id = searchParams.id ?? null;
  const qs = id ? `?id=${id}` : "";
  const { data, patch, hasHydrated } = useActiveBiodata(id);

  const realView = buildBiodataView(data);
  const view = realView.sections.length > 0 ? realView : SAMPLE_VIEW;

  function choose(templateId: TemplateId) {
    patch({ meta: { ...data.meta, templateId } });
    router.push(`/form${qs}`);
  }

  if (id && !hasHydrated) {
    return (
      <>
        <AppHeader />
        <div className="flex min-h-[60vh] items-center justify-center text-sm text-stone-400">
          Loading your biodata…
        </div>
      </>
    );
  }

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <h1 className="text-center text-2xl font-semibold text-stone-900">Choose a template</h1>
        <p className="mx-auto mt-2 max-w-md text-center text-sm text-stone-500">
          You can switch templates any time — your details carry over.
          {view === SAMPLE_VIEW && " Shown here with sample data."}
        </p>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => choose(t.id)}
              className="group flex flex-col overflow-hidden rounded-2xl border-2 border-stone-200 bg-white text-left transition-colors hover:border-stone-900"
            >
              <div className="pointer-events-none overflow-hidden bg-stone-100 p-3">
                <BiodataPreview view={view} templateId={t.id} />
              </div>
              <div className="p-4">
                <div className="font-semibold text-stone-900">{t.name}</div>
                <div className="mt-1 text-sm text-stone-500">{t.blurb}</div>
                <div className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-stone-900 group-hover:underline">
                  Use this template →
                </div>
              </div>
            </button>
          ))}
        </div>
      </main>
    </>
  );
}
