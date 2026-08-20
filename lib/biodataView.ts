import { BiodataFormValues, Sibling, invocationByReligion } from "./schema";

export interface ViewField {
  label: string;
  value: string;
}

export interface ViewSection {
  title: string;
  fields: ViewField[];
}

export interface QuickFact {
  label: string;
  value: string;
}

export interface BiodataView {
  name: string;
  invocation: string;
  photo: string | null;
  secondaryPhotos: string[];
  sections: ViewSection[];
  quickFacts: QuickFact[];
}

function clean(v: string | undefined | null): string {
  return (v ?? "").trim();
}

function has(v: string | undefined | null): boolean {
  return clean(v).length > 0;
}

function field(label: string, value: string | undefined | null): ViewField | null {
  return has(value) ? { label, value: clean(value) } : null;
}

function formatSibling(s: Sibling): string | null {
  const parts: string[] = [];
  if (has(s.maritalStatus)) parts.push(clean(s.maritalStatus));
  if (has(s.occupation)) parts.push(clean(s.occupation));
  const detail = parts.join(", ");
  if (has(s.name) && detail) return `${clean(s.name)} — ${detail}`;
  if (has(s.name)) return clean(s.name);
  if (detail) return detail;
  return null;
}

function formatSiblingGroup(list: Sibling[] | undefined, label: string): ViewField | null {
  if (!list || list.length === 0) return null;
  const lines = list
    .map((s) => formatSibling(s))
    .filter((v): v is string => !!v);
  if (lines.length === 0) return null;
  return { label, value: lines.join("; ") };
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatDateOfBirth(value: string | undefined): string {
  if (!has(value)) return "";
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(clean(value));
  if (!match) return clean(value);
  const [, year, month, day] = match;
  const monthName = MONTH_NAMES[Number(month) - 1];
  if (!monthName) return clean(value);
  return `${Number(day)} ${monthName} ${year}`;
}

function formatTimeOfBirth(value: string | undefined): string {
  if (!has(value)) return "";
  const match = /^(\d{2}):(\d{2})$/.exec(clean(value));
  if (!match) return clean(value);
  let hour = Number(match[1]);
  const minute = match[2];
  const period = hour >= 12 ? "PM" : "AM";
  hour = hour % 12 || 12;
  return `${hour}:${minute} ${period}`;
}

export function computeAge(dateOfBirth: string | undefined): string {
  if (!has(dateOfBirth)) return "";
  const dob = new Date(dateOfBirth as string);
  if (isNaN(dob.getTime())) return "";
  const now = new Date();
  let age = now.getFullYear() - dob.getFullYear();
  const monthDiff = now.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
    age--;
  }
  return age >= 0 && age < 130 ? String(age) : "";
}

export function buildBiodataView(data: BiodataFormValues): BiodataView {
  const { personal, astro, education, family, contact, photo, meta } = data;

  const age = has(personal.age) ? personal.age : computeAge(personal.dateOfBirth);

  const personalFields = [
    field("Date of Birth", formatDateOfBirth(personal.dateOfBirth)),
    field("Time of Birth", formatTimeOfBirth(personal.timeOfBirth)),
    field("Place of Birth", personal.placeOfBirth),
    field("Age", age),
    field("Height", personal.height),
    field("Weight", personal.weight),
    field("Complexion", personal.complexion),
    field("Blood Group", personal.bloodGroup),
    field("Marital Status", personal.maritalStatus),
    field("Diet", personal.diet),
    field("Languages Known", personal.languagesKnown?.join(", ")),
    field("Hobbies", personal.hobbies?.join(", ")),
  ].filter((f): f is ViewField => !!f);

  const astroFields = [
    field("Religion", astro.religion),
    field("Caste", astro.caste),
    field("Sub-caste", astro.subCaste),
    field("Gotra", astro.gotra),
    field("Rashi", astro.rashi),
    field("Nakshatra", astro.nakshatra),
    field("Manglik", astro.manglik),
    field("Gan", astro.gan),
    field("Nadi", astro.nadi),
    field("Charan", astro.charan),
  ].filter((f): f is ViewField => !!f);

  const educationFields = [
    field("Highest Qualification", education.highestQualification),
    field("Specialization", education.specialization),
    field("Institution", education.institution),
    field("Additional Qualifications", education.additionalQualifications?.join(", ")),
    field("Occupation", education.occupation),
    field("Designation", education.designation),
    field("Organization", education.organization),
    field("Work Location", education.workLocation),
    field("Annual Income", education.annualIncome),
    field("Years of Experience", education.yearsOfExperience),
  ].filter((f): f is ViewField => !!f);

  const familyFields = [
    field("Father's Name", family.fatherName),
    field("Father's Occupation", family.fatherOccupation),
    field("Mother's Name", family.motherName),
    field("Mother's Occupation", family.motherOccupation),
    formatSiblingGroup(family.brothers, "Brothers"),
    formatSiblingGroup(family.sisters, "Sisters"),
    field("Family Type", family.familyType),
    field("Family Values", family.familyValues),
    field("Native Place", family.nativePlace),
    field("Family Background", family.familyBackground),
  ].filter((f): f is ViewField => !!f);

  const contactFields = [
    field("Contact Person", contact.contactPersonName),
    field("Relation", contact.contactPersonRelation),
    field("Phone", contact.primaryPhone),
    field("Alternate Phone", contact.alternatePhone),
    field("Email", contact.email),
    field("Address", contact.residenceAddress),
  ].filter((f): f is ViewField => !!f);

  const sections: ViewSection[] = [
    { title: "Personal Details", fields: personalFields },
    { title: "Religious & Astrological", fields: astroFields },
    { title: "Education & Career", fields: educationFields },
    { title: "Family Details", fields: familyFields },
    { title: "Contact", fields: contactFields },
  ].filter((s) => s.fields.length > 0);

  const qualificationParts = [education.highestQualification, education.occupation]
    .filter((v) => has(v))
    .join(", ");

  const quickFacts: QuickFact[] = [
    field("Height", personal.height),
    field("Religion", astro.religion),
    field("Qualification", qualificationParts),
    field("Location", education.workLocation),
  ].filter((f): f is ViewField => !!f);

  // `undefined` means "never touched, use the religion default"; an explicit
  // "" means the user removed the invocation line on purpose — respect it.
  const invocation =
    meta.invocation !== undefined
      ? clean(meta.invocation)
      : (astro.religion && invocationByReligion[astro.religion]) || "";

  return {
    name: has(personal.fullName) ? clean(personal.fullName) : "Your Name",
    invocation,
    photo: photo.primary ?? null,
    secondaryPhotos: photo.secondary ?? [],
    sections,
    quickFacts,
  };
}
