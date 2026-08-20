"use client";

import { TextField, TagsField, FieldRow } from "./FormPrimitives";

export function StepEducation() {
  return (
    <div className="flex flex-col gap-5">
      <FieldRow>
        <TextField name="education.highestQualification" label="Highest Qualification" placeholder="M.Tech, Computer Science" />
        <TextField name="education.specialization" label="Specialization" />
      </FieldRow>
      <TextField name="education.institution" label="College / University" />
      <TagsField name="education.additionalQualifications" label="Additional Qualifications" placeholder="MBA, CFA" />
      <FieldRow>
        <TextField name="education.occupation" label="Occupation" placeholder="Software Engineer" />
        <TextField name="education.designation" label="Designation" />
      </FieldRow>
      <FieldRow>
        <TextField name="education.organization" label="Company / Organization" />
        <TextField name="education.workLocation" label="Work Location" placeholder="Bengaluru, Karnataka" />
      </FieldRow>
      <FieldRow>
        <TextField name="education.annualIncome" label="Annual Income" placeholder="₹18,00,000 per annum" />
        <TextField name="education.yearsOfExperience" label="Years of Experience" />
      </FieldRow>
    </div>
  );
}
