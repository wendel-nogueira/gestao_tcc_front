import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { File, User as UserIcon } from "@phosphor-icons/react";
import { Separator } from "@/components/ui/separator";
import FormEdict from "@/components/modules/edict/form/Form";
import ListWorks from "@/components/modules/work/list/List";
import ListSchedule from "@/components/modules/schedule/list/List";
import { Schedule } from "@/core/models/Schedule";
import { EdictServices } from "@/core/services/EdictServices";
import { Edict } from "@/core/models/Edict";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Edit() {
  const [id, setId] = useState<string | undefined>(undefined);
  const [edict, setEdict] = useState<Edict | undefined>(undefined);
  const [schedule, setSchedule] = useState<Schedule[]>([]);
  const [activeTab, setActiveTab] = useState("works");

  const edictServices = EdictServices();

  useEffect(() => {
    const id = window.location.pathname.split("/").pop();

    if (id) {
      setId(id);
    } else {
      window.location.href = "/home";
    }
  }, []);

  const scheduleOrder = [
    "tcc_register",
    "partial_version",
    "final_version",
    "tcc_defense",
  ];

  useEffect(() => {
    if (!id) return;

    edictServices
      .fetchEdict(id)
      .then((edict) => {
        console.log("Edict fetched", edict);
        setEdict(edict);

        const schedule = edict.schedule!.sort(
          (a, b) =>
            scheduleOrder.indexOf(a.name) - scheduleOrder.indexOf(b.name)
        );

        setSchedule(schedule || []);
      })
      .catch((error) => {
        console.error("Failed to fetch edict", error);
      });
  }, [id]);

  function onSubmit(edict: any) {
    for (const item of schedule) {
      if (!item.startDate || !item.endDate) {
        alert("Please fill in all fields of the schedule");
        return;
      }
    }

    const edictToUpdate = {
      ...edict,
      id,
      description: edict.description || "",
      schedule,
    };

    edictServices.updateEdict(edictToUpdate).then(
      () => {
        alert("Edict updated successfully");
      },
      () => {
        alert("An error occurred while updating the edict");
      }
    );
  }

  return (
    <div className="w-full mt-8">
      <h1 className="text-4xl font-bold text-gray-700">Edict</h1>

      <Separator className="my-10 h-[1px]" />

      <div className="w-full flex gap-8">
        <div className="w-full h-full max-w-80 flex flex-col gap-2">
          <div
            className={
              "w-full bg-white flex items-center rounded-lg px-6 py-2 hover:bg-slate-100 cursor-pointer transition duration-300" +
              (activeTab === "works" ? " bg-slate-100" : "")
            }
            onClick={() => setActiveTab("works")}
          >
            <p className="text-sm font-medium text-gray-700">Works</p>
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
              (activeTab === "schedule" ? " bg-slate-100" : "")
            }
            onClick={() => setActiveTab("schedule")}
          >
            <p className="text-sm font-medium text-gray-700">Schedule</p>
          </div>
        </div>

        <div className="w-full h-full">
          <div className={"w-full" + (activeTab === "works" ? "" : " hidden")}>
            <div className="w-full flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-700">Works</h2>
              {id && (
                <Link href={`/works/create?edictId=${id}`}>
                  <Button variant="outline">
                    <File className="mr-2" size={16} /> Add Work
                  </Button>
                </Link>
              )}
            </div>

            <div className="w-full h-full mt-5">
              <ListWorks />
            </div>
          </div>

          <div className={"w-full" + (activeTab === "edit" ? "" : " hidden")}>
            <FormEdict onSubmit={onSubmit} edict={edict} />
          </div>

          <div
            className={"w-full" + (activeTab === "schedule" ? "" : " hidden")}
          >
            <h2 className="text-2xl font-bold text-gray-700">Schedule</h2>

            <div className="w-full h-full mt-5">
              <ListSchedule schedule={schedule} setSchedule={setSchedule} />
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
