"use strict";

import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import FormBoard from "@/components/modules/board/form/form";
import ListVersion from "@/components/modules/version/list/List";
import { Work } from "@/core/models/Work";
import { Version } from "@/core/models/Version";
import { WorkServices } from "@/core/services/WorkServices";
import { useRouter } from "next/router";
import View from "@/components/modules/work/view/View";
import { Button } from "@/components/ui/button";
import { File } from "@phosphor-icons/react";
import DialogVersion from "@/components/modules/version/dialog/Dialog";

export default function Edit() {
  const [id, setId] = useState<string | undefined>(undefined);
  const [work, setWork] = useState<Work | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [versions, setVersions] = useState<Version[]>([]);
  const [activeTab, setActiveTab] = useState("info");

  const [dialog, setDialog] = useState(false);

  const workServices = WorkServices();
  const router = useRouter();

  useEffect(() => {
    const id = window.location.pathname.split("/")[2];

    setId(id);
  }, []);

  useEffect(() => {
    if (!id) return;

    workServices.fetchWork(id).then(
      (work: Work) => {
        setWork(work);
        setVersions(work.versions || []);
        setLoading(false);
      },
      (error) => {
        setLoading(false);
      }
    );
  }, [id]);

  return (
    <div className="w-full mt-8">
      <h1 className="text-4xl font-bold text-gray-700">Work</h1>

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
              (activeTab === "versions" ? " bg-slate-100" : "")
            }
            onClick={() => setActiveTab("versions")}
          >
            <p className="text-sm font-medium text-gray-700">Versions</p>
          </div>
          {/* <div
            className={
              "w-full bg-white flex items-center rounded-lg px-6 py-2 hover:bg-slate-100 cursor-pointer transition duration-300" +
              (activeTab === "edit" ? " bg-slate-100" : "")
            }
            onClick={() => setActiveTab("edit")}
          >
            <p className="text-sm font-medium text-gray-700">Edit</p>
          </div> */}
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
          <div className={"w-full" + (activeTab === "info" ? "" : " hidden")}>
            <View work={work} loading={loading} />
          </div>
          <div
            className={"w-full" + (activeTab === "versions" ? "" : " hidden")}
          >
            <div className="w-full flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-700">Versions</h2>
              <Button variant="outline" onClick={() => setDialog(true)}>
                <File className="mr-2" size={16} /> Add version
              </Button>
            </div>

            <div className="w-full h-full mt-5">
              <ListVersion versions={versions} loading={loading} />
            </div>

            {id && (
              <DialogVersion
                open={dialog}
                onClose={() => setDialog(false)}
                workId={id}
              />
            )}
          </div>

          {/* <div className={"w-full" + (activeTab === "edit" ? "" : " hidden")}>
            <FormWork />
          </div> */}

          <div className={"w-full" + (activeTab === "board" ? "" : " hidden")}>
            <h2 className="text-2xl font-bold text-gray-700">Board</h2>

            <div className="w-full h-full mt-5">
              {work && <FormBoard work={work} board={work?.board} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
