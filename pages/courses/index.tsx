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
import { Course } from "@/core/models/Course";
import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CourseServices } from "@/core/services/CourseServices";
import api from "axios";

export default function Courses() {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([] as Course[]);
  const courseServices = CourseServices();
  const [teachers, setTeachers] = useState([]);
  const url = "https://285d2cd5de532ee05558003c9c675417.loophole.site";

  useEffect(() => {
    async function fetchTeachers() {
      try {
        const response = await api.get(`${url}/api/users`);
        const filteredTeachers = response.data.filter((user: any) => user.role === "Teacher");
        console.log(filteredTeachers);
        setTeachers(filteredTeachers);
      } catch (error) {
        console.error("Failed to fetch teachers", error);
      }
    }

    fetchTeachers();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      const courses = await courseServices.fetchCourses().catch((error) => {
        console.error(error);
        return [];
      });

      if (!courses || courses.length === 0) return;

      const allCourses = courses.map((course) => {
        const coordinator = teachers.find((teacher: any) => teacher.id === course.coordinator);
        const tccCoordinator = teachers.find((teacher: any) => teacher.id === course.tccCoordinator);

        return {
          id: course.id!,
          name: course.name!,
          acronym: course.acronym!,
          coordinator: coordinator ? coordinator.name : "Unknown",
          tccCoordinator: tccCoordinator ? tccCoordinator.name : "Unknown",
        };
      });

      setCourses(allCourses);
      setLoading(false);
    };

    fetchCourses();
  }, [courseServices]);

  return (
    <div className="p-6 space-y-6 mt-10">
      <DataTable data={courses} columns={columns} loading={loading} />
    </div>
  );
}

export const columns: ColumnDef<any>[] = [
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
    cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
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
    accessorKey: "coordinator",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Coordinator
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("coordinator")}</div>
    ),
  },
  {
    accessorKey: "tccCoordinator",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          TCC Coordinator
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("tccCoordinator")}</div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const user = row.original;

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
              <Link href={`/courses/${user.id}`}>View course</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
