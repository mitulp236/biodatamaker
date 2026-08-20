"use client";

import { useFormContext } from "react-hook-form";
import { TextField, SelectField, TagsField, RadioPillsField, FieldRow } from "./FormPrimitives";
import { BiodataFormValues, dietOptions, maritalStatusOptions } from "@/lib/schema";
import { computeAge } from "@/lib/biodataView";

export function StepPersonal() {
  const { watch } = useFormContext<BiodataFormValues>();
  const dob = watch("personal.dateOfBirth");
  const suggestedAge = computeAge(dob);

  return (
    <div className="flex flex-col gap-5">
      <TextField name="personal.fullName" label="Full Name" placeholder="As it should appear on the biodata" />
      <FieldRow>
        <TextField name="personal.dateOfBirth" label="Date of Birth" type="date" />
        <TextField
          name="personal.age"
          label="Age"
          placeholder={suggestedAge || "Auto-filled from DOB"}
          hint={suggestedAge ? `Calculated as ${suggestedAge} — edit if needed` : undefined}
        />
      </FieldRow>
      <FieldRow>
        <TextField name="personal.timeOfBirth" label="Time of Birth" type="time" />
        <TextField name="personal.placeOfBirth" label="Place of Birth" placeholder="City, State" />
      </FieldRow>
      <FieldRow>
        <TextField name="personal.height" label="Height" placeholder="5 ft 6 in (168 cm)" />
        <TextField name="personal.weight" label="Weight" placeholder="60 kg" />
      </FieldRow>
      <FieldRow>
        <TextField name="personal.complexion" label="Complexion" placeholder="Fair" />
        <TextField name="personal.bloodGroup" label="Blood Group" placeholder="B+" />
      </FieldRow>
      <SelectField name="personal.maritalStatus" label="Marital Status" options={maritalStatusOptions} />
      <RadioPillsField name="personal.diet" label="Diet" options={dietOptions} />
      <TagsField name="personal.languagesKnown" label="Languages Known" placeholder="Hindi, English, Gujarati" />
      <TagsField name="personal.hobbies" label="Hobbies" placeholder="Reading, travel, cooking" />
    </div>
  );
}
