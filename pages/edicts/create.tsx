import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Calendar, User as UserIcon } from "@phosphor-icons/react";
import { Separator } from "@/components/ui/separator";
import FormEdict from "@/components/modules/edict/form/Form";
import ListWorks from "@/components/modules/work/list/List";
import ListSchedule from "@/components/modules/schedule/list/List";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Create() {
  const [activeTab, setActiveTab] = useState("info");

  return (
    <div className="w-full mt-8">
      <h1 className="text-4xl font-bold text-gray-700">Edict</h1>

      <Separator className="my-10 h-[1px]" />

      <div className="w-full flex gap-8">
        <div className="w-full h-full max-w-80 flex flex-col gap-2">
          <div
            className={
              "w-full bg-white flex items-center rounded-lg px-6 py-2 hover:bg-slate-100 cursor-pointer transition duration-300" +
              (activeTab === "info" ? " bg-slate-100" : "")
            }
            onClick={() => setActiveTab("info")}
          >
            <p className="text-sm font-medium text-gray-700">Info</p>
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
          <div className={"w-full" + (activeTab === "info" ? "" : " hidden")}>
            <FormEdict />
          </div>

          <div
            className={"w-full" + (activeTab === "schedule" ? "" : " hidden")}
          >
            <h2 className="text-2xl font-bold text-gray-700">Schedule</h2>

            <div className="w-full h-full mt-5">
              <ListSchedule />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
