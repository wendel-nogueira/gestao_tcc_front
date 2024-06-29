"use strict";

import FormWork from "@/components/modules/work/form/Form";

export default function Create() {
  return (
    <div className="flex flex-col space-y-8 w-full max-w-md mx-auto mt-32">
      <div className="flex flex-col space-y-2 text-center">
        <h2 className="text-2xl font-bold text-gray-600">Create Work</h2>
        <p className="text-gray-500 text-sm font-normal">
          Register a new work to the system.
        </p>
      </div>

      <FormWork />
    </div>
  );
}
