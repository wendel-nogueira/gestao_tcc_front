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
import { Info } from "@/core/models/User";
import { Work } from "@/core/models/Work";
import { UserServices } from "@/core/services/UserServices";
import { WorkServices } from "@/core/services/WorkServices";
import { CaretSortIcon, DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ListWorks() {
  const [loading, setLoading] = useState(false);
  const [works, setWorks] = useState<Work[]>([]);
  const [students, setStudents] = useState<Info[]>([]);

  const userServices = UserServices();
  const workServices = WorkServices();

  useEffect(() => {
    setLoading(true);

    workServices
      .fetchWorks()
      .then((works) => {
        works.forEach((work) => {
          const student = students.find(
            (student) => student.id === work.student
          );
          const knowledgeArea = areas.find(
            (area) => area.value === work.knowledgeArea
          );
          const workStatus = status.find(
            (status) => status.value === work.status
          );

          work.student = student?.name || "Unknown";
          work.knowledgeArea = knowledgeArea?.label || "Unknown";
          work.status = workStatus?.label || "Unknown";
        });

        setWorks(works);
      })
      .catch((error) => {
        console.error("Failed to fetch works", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [students]);

  useEffect(() => {
    userServices
      .fetchUsers()
      .then((students) => {
        console.log("Students fetched", students);
        setStudents(students);
      })
      .catch((error) => {
        console.error("Failed to fetch students", error);
      });
  }, []);

  return <DataTable data={works} columns={columns} loading={loading} />;
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
    accessorKey: "student",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Student
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("student")}</div>
    ),
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("title")}</div>,
  },
  {
    accessorKey: "knowledgeArea",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Area
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("knowledgeArea")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("status")}</div>
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
              <Link href={`/works/${user.id}`}>View work</Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const areas = [
  { value: 0, label: "Administration" },
  { value: 1, label: "Human Aspects" },
  { value: 2, label: "Software Development" },
  { value: 3, label: "Computation Mathematics" },
  { value: 4, label: "Computation Methods" },
  { value: 5, label: "Data Persistence" },
  { value: 6, label: "Networks" },
  { value: 7, label: "Computation Theory" },
];

const status = [
  { value: 0, label: "Pending" },
  { value: 1, label: "Approved by advisor" },
  { value: 2, label: "Reproved by advisor" },
  { value: 3, label: "Pending coordinator" },
  { value: 4, label: "Approved by coordinator" },
  { value: 5, label: "Reproved by coordinator" },
  { value: 6, label: "In progress" },
  { value: 7, label: "Concluded approved" },
  { value: 8, label: "Concluded reproved" },
];
