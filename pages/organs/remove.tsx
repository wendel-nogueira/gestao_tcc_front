import { DataTable } from "@/components/shared/dataTable/DataTable";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Organ } from "@/core/models/Organ";
import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useEffect, useState } from "react";
import { OrganServices } from "@/core/services/OrganServices";
import api from "axios";
import { CourseServices } from "@/core/services/CourseServices";
import { Course } from "@/core/models/Course";
import { AuthServices } from "@/core/services/AuthServices";

export default function Organs() {
  const [loading, setLoading] = useState(false);
  const [organs, setOrgans] = useState<Organ[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const authServices = AuthServices();
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

  const organServices = OrganServices();
  const courseServices = CourseServices();
  
  useEffect(() => {
    const verifyUserRole = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/";
        return;
      }

      const data = authServices.parseJwt(token as string);
      setCurrentUserRole(data.role);
      setLoading(false);
    };

    verifyUserRole();
  }, []);

  useEffect(() => {
    setLoading(true);

    courseServices
      .fetchCourses()
      .then((courses) => {
        setCourses(courses);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch courses", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (courses.length === 0) return;

    setLoading(true);

    organServices
      .fetchOrgans()
      .then((organs) => {
        const allOrgans = organs.map((organ) => {
          console.log(organ);
          console.log(courses);
          const course = courses.find(
            (course: any) => course.id === organ.courseId
          ) as any;

          return {
            id: organ.id!,
            name: organ.name!,
            acronym: organ.acronym!,
            course: course ? course.name : "No course",
          } as any;
        });

        setOrgans(allOrgans);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch organs", error);
        setLoading(false);
      });
  }, [courses]);

  const handleRemoveOrgan = async (organId: string) => {
    setLoading(true);
    try {
      console.log(`Removing organ with ID: ${organId}`);
      await organServices.removeOrgan(organId);
      setOrgans(organs.filter((organ) => organ.id !== organId));
      alert("Organ removed successfully");
    } catch (error: any) {
      console.error("Failed to remove organ", error);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
        console.error("Error response headers:", error.response.headers);
      }
      alert("An error occurred while removing the organ");
    } finally {
      setLoading(false);
    }
  };

  const columns: ColumnDef<any>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value: any) =>
            table.toggleAllPageRowsSelected(!!value)
          }
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value: any) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("name")}</div>
      ),
    },
    {
      accessorKey: "acronym",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Acronym
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("acronym")}</div>
      ),
    },
    {
      accessorKey: "course",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Course
            <CaretSortIcon className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue("course")}</div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const organ = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="z-10 bg-white p-2">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <Link href={`/organs/${organ.id}`}>View organ</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleRemoveOrgan(organ.id)}>
                Remove organ
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="p-6 space-y-6 mt-10">
      <DataTable data={organs} columns={columns} loading={loading} />
    </div>
  );
}
