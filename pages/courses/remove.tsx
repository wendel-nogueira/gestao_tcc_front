// pages/courses.tsx

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
import { UserServices } from "@/core/services/UserServices";
import { Info } from "@/core/models/User";

export default function Courses() {
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Info[]>([]);
  const courseServices = CourseServices();
  const userService = UserServices();

  useEffect(() => {
    setLoading(true);

    userService
      .fetchUsers()
      .then((users: Info[]) => {
        const filteredTeachers = users.filter(
          (user: any) => user.role === "Teacher"
        );

        setTeachers(filteredTeachers);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch teachers", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (teachers.length === 0) return;

    setLoading(true);

    courseServices
      .fetchCourses()
      .then((courses) => {
        const allCourses = courses.map((course) => {
          const coordinator = teachers.find(
            (teacher: any) => teacher.id === course.coordinator
          ) as any;
          const tccCoordinator = teachers.find(
            (teacher: any) => teacher.id === course.tccCoordinator
          ) as any;

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
      })
      .catch((error) => {
        console.error("Failed to fetch courses", error);
        setLoading(false);
      });
  }, [teachers]);

  const handleRemoveCourse = async (courseId: string) => {
    setLoading(true);
    try {
      await courseServices.removeCourse(courseId);
      setCourses(courses.filter(course => course.id !== courseId));
      alert('Course removed successfully');
    } catch (error) {
      console.error('Failed to remove course', error);
      alert('An error occurred while removing the course');
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
        const course = row.original;

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
                <Link href={`/courses/${course.id}`}>View course</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleRemoveCourse(course.id)}>
                Remove course
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <div className="p-6 space-y-6 mt-10">
      <DataTable data={courses} columns={columns} loading={loading} />
    </div>
  );
}
