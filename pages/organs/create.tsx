"use strict";
import FormOrgan from "@/components/modules/organ/form/Form";

export default function Create() {
  return (
    <div className="flex flex-col space-y-8 w-full max-w-md mx-auto mt-32">
      <div className="flex flex-col space-y-2 text-center">
        <h2 className="text-2xl font-bold text-gray-600">Create Organ</h2>
        <p className="text-gray-500 text-sm font-normal">
          Create a new organ by filling the form below.
        </p>
      </div>

      <FormOrgan />
    </div>
  );
}
