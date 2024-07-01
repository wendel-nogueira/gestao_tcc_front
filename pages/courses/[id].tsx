"use strict";

import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import FormCourse from "@/components/modules/course/form/Form";
import ListEdict from "@/components/modules/edict/list/List";
import ListStudents from "@/components/modules/students/list/List";
import { Button } from "@/components/ui/button";
import { Calendar } from "@phosphor-icons/react";
import Link from "next/link";
import { Course } from "@/core/models/Course";
import { CourseServices } from "@/core/services/CourseServices";
import { Edict } from "@/core/models/Edict";

export default function Edit() {
  const [loading, setLoading] = useState(true);
  const [id, setId] = useState<string | undefined>(undefined);
  const [course, setCourse] = useState<Course | undefined>(undefined);
  const [edicts, setEdicts] = useState<Edict[]>([]);
  const [activeTab, setActiveTab] = useState("edict");

  const courseServices = CourseServices();

  useEffect(() => {
    const id = window.location.pathname.split("/").pop();

    if (id) {
      setId(id);
    } else {
      window.location.href = "/home";
    }
  }, []);

  useEffect(() => {
    if (!id) return;

    setLoading(true);

    courseServices
      .fetchCourse(id)
      .then((course) => {
        console.log("Course fetched", course);
        setCourse(course);
        setEdicts(course.edicts || []);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch course", error);
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="w-full mt-8">
      <h1 className="text-4xl font-bold text-gray-700">Course</h1>

      <Separator className="my-10 h-[1px]" />

      <div className="w-full flex gap-8">
        <div className="w-full h-full max-w-80 flex flex-col gap-2">
          <div
            className={
              "w-full bg-white flex items-center rounded-lg px-6 py-2 hover:bg-slate-100 cursor-pointer transition duration-300" +
              (activeTab === "edict" ? " bg-slate-100" : "")
            }
            onClick={() => setActiveTab("edict")}
          >
            <p className="text-sm font-medium text-gray-700">Edicts</p>
          </div>
          {/* <div
            className={
              "w-full bg-white flex items-center rounded-lg px-6 py-2 hover:bg-slate-100 cursor-pointer transition duration-300" +
              (activeTab === "students" ? " bg-slate-100" : "")
            }
            onClick={() => setActiveTab("students")}
          >
            <p className="text-sm font-medium text-gray-700">Students</p>
          </div> */}
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
          <div className={"w-full" + (activeTab === "edict" ? "" : " hidden")}>
            <div className="w-full flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-700">Edicts</h2>
              {id && (
                <Link href={`/edicts/create?courseId=${id}`}>
                  <Button variant="outline">
                    <Calendar className="mr-2" size={16} /> Add Edict
                  </Button>
                </Link>
              )}
            </div>

            <div className="w-full h-full mt-5">
              <ListEdict edicts={edicts} />
            </div>
          </div>

          <div className={"w-full" + (activeTab === "edit" ? "" : " hidden")}>
            <FormCourse course={course} />
          </div>

          {/* <div
            className={"w-full" + (activeTab === "students" ? "" : " hidden")}
          >
            <h2 className="text-2xl font-bold text-gray-700">Students</h2>

            <div className="w-full h-full mt-5">
              <ListStudents />
            </div>
          </div> */}
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
