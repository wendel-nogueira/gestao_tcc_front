import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { User as UserIcon } from "@phosphor-icons/react";
import { Separator } from "@/components/ui/separator";
import FormCourse from "@/components/modules/course/form/Form";
import ListEdict from "@/components/modules/edict/list/List";
import FormBoard from "@/components/modules/board/form/form";
import ListVersion from "@/components/modules/version/list/List";
import FormWork from "@/components/modules/work/form/Form";

export default function Edit() {
  const [activeTab, setActiveTab] = useState("versions");

  return (
    <div className="w-full mt-8">
      <h1 className="text-4xl font-bold text-gray-700">Work</h1>

      <Separator className="my-10 h-[1px]" />

      <div className="w-full flex gap-8">
        <div className="w-full h-full max-w-80 flex flex-col gap-2">
          <div
            className={
              "w-full bg-white flex items-center rounded-lg px-6 py-2 hover:bg-slate-100 cursor-pointer transition duration-300" +
              (activeTab === "versions" ? " bg-slate-100" : "")
            }
            onClick={() => setActiveTab("versions")}
          >
            <p className="text-sm font-medium text-gray-700">Versions</p>
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
          <div
            className={
              "w-full bg-white flex items-center rounded-lg px-6 py-2 hover:bg-slate-100 cursor-pointer transition duration-300" +
              (activeTab === "board" ? " bg-slate-100" : "")
            }
            onClick={() => setActiveTab("board")}
          >
            <p className="text-sm font-medium text-gray-700">Board</p>
          </div>
        </div>

        <div className="w-full h-full">
          <div
            className={"w-full" + (activeTab === "versions" ? "" : " hidden")}
          >
            <h2 className="text-2xl font-bold text-gray-700">Versions</h2>

            <div className="w-full h-full mt-5">
              <ListVersion />
            </div>
          </div>

          <div className={"w-full" + (activeTab === "edit" ? "" : " hidden")}>
            <FormWork />
          </div>

          <div className={"w-full" + (activeTab === "board" ? "" : " hidden")}>
            <h2 className="text-2xl font-bold text-gray-700">Board</h2>

            <div className="w-full h-full mt-5">
              <FormBoard />
            </div>
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
