import { z } from "zod";

export const dietOptions = ["Veg", "Non-veg", "Eggetarian", "Jain", "Vegan"] as const;
export const maritalStatusOptions = [
  "Never Married",
  "Divorced",
  "Widowed",
  "Awaiting Divorce",
] as const;
export const manglikOptions = ["Yes", "No", "Anshik", "Don't know"] as const;
export const familyTypeOptions = ["Nuclear", "Joint"] as const;
export const familyValuesOptions = ["Traditional", "Moderate", "Liberal"] as const;
export const genderOptions = ["Boy", "Girl"] as const;
export const templateIds = ["traditional", "modern", "botanical"] as const;
export type TemplateId = (typeof templateIds)[number];
export const religionOptions = [
  "Hindu",
  "Muslim",
  "Sikh",
  "Jain",
  "Christian",
  "Buddhist",
  "Other",
  "Prefer not to say",
] as const;

// Transliterated to Latin script by default so the PDF's embedded Latin
// font subsets can render them (Devanagari/Gurmukhi/Arabic embedding is v2,
// see PRD §14). The field is free text — a user can type the native script
// instead, at their own risk of tofu glyphs in the exported PDF.
export const invocationByReligion: Record<string, string> = {
  Hindu: "|| Shree Ganeshaya Namah ||",
  Muslim: "Bismillah-ir-Rahman-ir-Rahim",
  Sikh: "Ik Onkar Sat Naam",
  Jain: "|| Namokar Mantra ||",
};

const siblingSchema = z.object({
  name: z.string().optional(),
  maritalStatus: z.string().optional(),
  occupation: z.string().optional(),
});

export const biodataSchema = z.object({
  meta: z.object({
    gender: z.enum(genderOptions).optional(),
    templateId: z.enum(templateIds).optional(),
    invocation: z.string().optional(),
  }),

  personal: z.object({
    fullName: z.string().optional(),
    dateOfBirth: z.string().optional(),
    timeOfBirth: z.string().optional(),
    placeOfBirth: z.string().optional(),
    age: z.string().optional(),
    height: z.string().optional(),
    weight: z.string().optional(),
    complexion: z.string().optional(),
    bloodGroup: z.string().optional(),
    maritalStatus: z.enum(maritalStatusOptions).optional(),
    diet: z.enum(dietOptions).optional(),
    languagesKnown: z.array(z.string()).optional(),
    hobbies: z.array(z.string()).optional(),
  }),

  astro: z.object({
    religion: z.string().optional(),
    caste: z.string().optional(),
    subCaste: z.string().optional(),
    gotra: z.string().optional(),
    rashi: z.string().optional(),
    nakshatra: z.string().optional(),
    manglik: z.enum(manglikOptions).optional(),
    gan: z.string().optional(),
    nadi: z.string().optional(),
    charan: z.string().optional(),
  }),

  education: z.object({
    highestQualification: z.string().optional(),
    specialization: z.string().optional(),
    institution: z.string().optional(),
    additionalQualifications: z.array(z.string()).optional(),
    occupation: z.string().optional(),
    designation: z.string().optional(),
    organization: z.string().optional(),
    workLocation: z.string().optional(),
    annualIncome: z.string().optional(),
    yearsOfExperience: z.string().optional(),
  }),

  family: z.object({
    fatherName: z.string().optional(),
    fatherOccupation: z.string().optional(),
    motherName: z.string().optional(),
    motherOccupation: z.string().optional(),
    brothers: z.array(siblingSchema).optional(),
    sisters: z.array(siblingSchema).optional(),
    familyType: z.enum(familyTypeOptions).optional(),
    familyValues: z.enum(familyValuesOptions).optional(),
    nativePlace: z.string().optional(),
    familyBackground: z.string().optional(),
  }),

  contact: z.object({
    contactPersonName: z.string().optional(),
    contactPersonRelation: z.string().optional(),
    primaryPhone: z.string().optional(),
    alternatePhone: z.string().optional(),
    email: z.string().optional(),
    residenceAddress: z.string().optional(),
  }),

  photo: z.object({
    primary: z.string().nullable().optional(),
    secondary: z.array(z.string()).optional(),
  }),
});

export type Sibling = z.infer<typeof siblingSchema>;
export type BiodataFormValues = z.infer<typeof biodataSchema>;

export const defaultBiodataValues: BiodataFormValues = {
  meta: { gender: undefined, templateId: undefined, invocation: undefined },
  personal: {
    fullName: "",
    dateOfBirth: "",
    timeOfBirth: "",
    placeOfBirth: "",
    age: "",
    height: "",
    weight: "",
    complexion: "",
    bloodGroup: "",
    maritalStatus: undefined,
    diet: undefined,
    languagesKnown: [],
    hobbies: [],
  },
  astro: {
    religion: "",
    caste: "",
    subCaste: "",
    gotra: "",
    rashi: "",
    nakshatra: "",
    manglik: undefined,
    gan: "",
    nadi: "",
    charan: "",
  },
  education: {
    highestQualification: "",
    specialization: "",
    institution: "",
    additionalQualifications: [],
    occupation: "",
    designation: "",
    organization: "",
    workLocation: "",
    annualIncome: "",
    yearsOfExperience: "",
  },
  family: {
    fatherName: "",
    fatherOccupation: "",
    motherName: "",
    motherOccupation: "",
    brothers: [],
    sisters: [],
    familyType: undefined,
    familyValues: undefined,
    nativePlace: "",
    familyBackground: "",
  },
  contact: {
    contactPersonName: "",
    contactPersonRelation: "",
    primaryPhone: "",
    alternatePhone: "",
    email: "",
    residenceAddress: "",
  },
  photo: { primary: null, secondary: [] },
};
