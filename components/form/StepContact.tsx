"use client";

import { TextField, TextAreaField, FieldRow } from "./FormPrimitives";

export function StepContact() {
  return (
    <div className="flex flex-col gap-5">
      <FieldRow>
        <TextField name="contact.contactPersonName" label="Contact Person" placeholder="Mr. R. Sharma (Father)" />
        <TextField name="contact.contactPersonRelation" label="Relation" placeholder="Father" />
      </FieldRow>
      <FieldRow>
        <TextField name="contact.primaryPhone" label="Phone" type="tel" placeholder="+91 98765 43210" />
        <TextField name="contact.alternatePhone" label="Alternate Phone" type="tel" />
      </FieldRow>
      <TextField name="contact.email" label="Email" type="email" />
      <TextAreaField name="contact.residenceAddress" label="Address" rows={3} />
    </div>
  );
}
