import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { User } from "@phosphor-icons/react";
import { Separator } from "@/components/ui/separator";
import FormOrgan from "@/components/modules/organ/form/Form";
import ListMembers from "@/components/modules/members/list/List";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Edit() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("members");

  return (
    <div className="w-full mt-8">
      <h1 className="text-4xl font-bold text-gray-700">Organ</h1>

      <Separator className="my-10 h-[1px]" />

      <div className="w-full flex gap-8">
        <div className="w-full h-full max-w-80 flex flex-col gap-2">
          <div
            className={
              "w-full bg-white flex items-center rounded-lg px-6 py-2 hover:bg-slate-100 cursor-pointer transition duration-300" +
              (activeTab === "edict" ? " bg-slate-100" : "")
            }
            onClick={() => setActiveTab("members")}
          >
            <p className="text-sm font-medium text-gray-700">Members</p>
          </div>
          <div
            className={
              "w-full bg-white flex items-center rounded-lg px-6 py-2 hover:bg-slate-100 cursor-pointer transition duration-300" +
              (activeTab === "edit" ? " bg-slate-100" : "")
            }
            onClick={() => setActiveTab("edit")}
          >
            <p className="text-sm font-medium text-gray-700">Edit</p>
          </div>
        </div>

        <div className="w-full h-full">
          <div
            className={"w-full" + (activeTab === "members" ? "" : " hidden")}
          >
            <div className="w-full flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-700">Members</h2>
              <Button variant="outline">
                <User className="mr-2" size={16} /> Add Member
              </Button>
            </div>

            <div className="w-full h-full mt-5">
              <ListMembers />
            </div>
          </div>

          <div className={"w-full" + (activeTab === "edit" ? "" : " hidden")}>
            <FormOrgan />
          </div>
        </div>
      </div>
    </div>
  );
}

const fields = {
  name: "Name",
  cpf: "CPF",
  birthDate: "Birth Date",
  sex: "Sex",
  isActive: "Active",
  registration: "Registration",
  course: "Course",
  admissionDate: "Admission Date",
  graduationDate: "Graduation Date",
  siape: "SIAPE",
  area: "Area",
  institution: "Institution",
  formation: "Formation",
};
