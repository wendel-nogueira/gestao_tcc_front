import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { User } from "@phosphor-icons/react";
import { Separator } from "@/components/ui/separator";
import FormOrgan from "@/components/modules/organ/form/Form";
import ListMembers from "@/components/modules/members/list/List";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { OrganServices } from "@/core/services/OrganServices";
import { Organ } from "@/core/models/Organ";
import DialogMembers from "@/components/modules/members/dialog/Dialog";

export default function Edit() {
  const [id, setId] = useState<string | undefined>();
  const [organ, setOrgan] = useState<Organ | undefined>();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("members");

  const [teachers, setTeachers] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const organService = OrganServices();

  useEffect(() => {
    const path = window.location.pathname.split("/").pop();

    if (!path) return;

    setId(path);
  }, []);

  useEffect(() => {
    if (!id) return;

    organService.fetchOrgan(id).then(
      (organ) => {
        console.log(organ);
        setOrgan(organ);
        console.log(organ.teachers);
        setTeachers(organ.teachers);
        setLoading(false);
      },
      (error) => {
        console.log(error);
      }
    );
  }, [id]);

  const handleRemoveTeacher = (memberId: string) => {
    if (!id) return;

    console.log("remove teacher", memberId);

    organService.removeMember(id, memberId).then(
      (response) => {
        setTeachers((prevState) => prevState.filter((id) => id !== memberId));
      },
      (error) => {
        console.log(error);
      }
    );
  };

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
              <Button variant="outline" onClick={() => setModalOpen(true)}>
                <User className="mr-2" size={16} /> Add Member
              </Button>
            </div>

            <div className="w-full h-full mt-5">
              <ListMembers
                teachers={teachers}
                removeTeacher={handleRemoveTeacher}
              />
              {id && (
                <DialogMembers
                  organId={id}
                  members={teachers}
                  open={modalOpen}
                  onClose={() => setModalOpen(false)}
                />
              )}
            </div>
          </div>

          <div className={"w-full" + (activeTab === "edit" ? "" : " hidden")}>
            <FormOrgan organ={organ} />
          </div>
        </div>
      </div>
    </div>
  );
}
