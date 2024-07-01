"use strict";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Info } from "@/core/models/User";
import { useEffect, useState } from "react";
import { UserServices } from "@/core/services/UserServices";
import { FileServices } from "@/core/services/FileServices";
import { WorkServices } from "@/core/services/WorkServices";
import { Work } from "@/core/models/Work";
import { useRouter } from "next/router";
import { AuthServices } from "@/core/services/AuthServices";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";
import { Calendar } from "@/components/ui/calendar";
import { Board } from "@/core/models/Board";
import { BoardFile } from "@/core/models/BoardFile";
import Link from "next/link";

export interface FormBoardProps {
  work: Work;
  board: Board | undefined;
  edit?: boolean;
}

export default function FormBoard(props: FormBoardProps) {
  return (
    <>
      {props.board ? (
        <FormBoardContent {...props} />
      ) : (
      <FormBoardEmpty {...props} />
      )}
    </>
  );
}

export function FormBoardContent(props: FormBoardProps) {
  const [users, setUsers] = useState<Info[]>([]);

  const userServices = UserServices();

  useEffect(() => {
    userServices.fetchUsers().then(
      (users: Info[]) => {
        console.log("Users", users);
        setUsers(users);
      },
      (error) => {
        console.error(error);
      }
    );
  }, []);

  return (
    <div className="w-full flex flex-col gap-2">
      <Card>
        <CardHeader>
          <CardTitle>Board Information</CardTitle>
          <CardDescription>View the information of the board</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="w-full flex gap-2 items-center">
            <div className="w-full flex flex-col gap-2">
              <h2 className="text-base font-semibold text-gray-700">Date</h2>
              <p className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
                {format(new Date(props.board!.date), "PPP")}
              </p>
            </div>
            <div className="w-full flex flex-col gap-2">
              <h2 className="text-base font-semibold text-gray-700">Time</h2>
              <p className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
                {props.board!.time}
              </p>
            </div>
          </div>
          <div className="w-full flex flex-col gap-2">
            <h2 className="text-base font-semibold text-gray-700">Place</h2>
            <p className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
              {props.board!.place}
            </p>
          </div>
          <div className="w-full flex flex-col gap-2">
            <h2 className="text-base font-semibold text-gray-700">Members</h2>
            <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
              <div className="flex flex-col gap-2">
                {props.board!.members.map((member) => (
                  <p key={member}>
                    {users.find((user) => user.id === member)?.name}
                  </p>
                ))}
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col gap-2">
            <h2 className="text-base font-semibold text-gray-700">Files</h2>

            <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
              <div className="flex flex-col gap-2">
                {props.board!.files.map((file) => (
                  <Link
                    href={file.path}
                    target="_blank"
                    passHref
                    key={file.path}
                  >
                    <p className="cursor-pointer text-blue-500">{file.name}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
}

export function FormBoardEmpty(props: FormBoardProps) {
  const [allUsers, setAllUsers] = useState<Info[]>([]);
  const [users, setUsers] = useState<Info[]>([]);

  const userServices = UserServices();
  const workServices = WorkServices();
  const fileServices = FileServices();
  const router = useRouter();

  const formSchema: any = z.object({
    date: z.date().refine((date) => date > new Date(), {
      message: "Date must be greater than today",
    }),
    time: z.string().nonempty("Time is required"),
    place: z.string().nonempty("Place is required"),
    file: z.string().nonempty("File is required"),
    path: z.string().optional().nullable(),
    member1: z.string().nonempty("Member 1 is required"),
    member2: z.string().nonempty("Member 2 is required"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    userServices.fetchUsers().then(
      (users: Info[]) => {
        setAllUsers(users);
        const tempUsers = users.filter(
          (user) =>
            user.id !== props.work?.student &&
            user.id !== props.work?.advisor &&
            user.id !== props.work?.coadvisor
        );
        setUsers(tempUsers);

        // setUsers(users);
        // setLoading(false);
      },
      (error) => {
        console.error(error);
        // setLoading(false);
      }
    );
  }, [props.work]);

  useEffect(() => {
    if (!props.work.board) return;

    // set optional fields

    form.reset({
      date: new Date(props.work.board.date),
      time: props.work.board.time,
      place: props.work.board.place,
      file: "None",
      path: "None",
      member1: "None",
      member2: "None",
    });
  }, [props.work]);

  function onUpload(event: any, field: any) {
    const file = event.target.files[0];

    fileServices
      .uploadFile(file)
      .then((result) => {
        const path = result.uri;
        form.setValue("path", path);
      })
      .catch((error) => {
        console.error("Failed to upload file", error);
      });
  }

  function onSubmit(data: any) {
    console.log("Form data", data);

    const members = [];

    members.push(props.work.advisor);
    if (props.work.coadvisor) members.push(props.work.coadvisor);

    members.push(data.member1);
    members.push(data.member2);

    console.log(data);
    const files = [
      {
        name: "Final Work",
        path: data.path,
      },
    ] as BoardFile[];

    console.log("Members", members);
    console.log("Files", files);

    let board = {
      date: data.date,
      time: data.time,
      place: data.place,
      members: members,
      files: files,
    } as Board;

    console.log("Board", JSON.stringify(board));

    if (props.board) {
      workServices
        .updateBoard(props.work.id!, board)
        .then((board) => {
          console.log("Board updated", board);
          alert("Board updated successfully");
          router.push(`/works/${props.work.id}`);
        })
        .catch((error) => {
          console.error("Failed to update board", error);
        });
      return;
    } else {
      workServices
        .addBoard(props.work.id!, board)
        .then((board) => {
          console.log("Board added", board);
          alert("Board requested successfully");
          router.push(`/works/${props.work.id}`);
        })
        .catch((error) => {
          console.error("Failed to add board", error);
        });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <Card>
          <CardHeader>
            <CardTitle>Board</CardTitle>
            <CardDescription>
              {props.work.board
                ? "Edit the board information"
                : "Request a board for the work"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="w-full flex items-start gap-2">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col mt-1 max-w-52">
                    <FormLabel className="mb-[6px]">Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                  <FormItem className="w-full flex flex-col mt-[0.65rem] max-w-52">
                    <FormLabel>Time</FormLabel>
                    <FormControl>
                      <Input placeholder="Time" {...field} type="time" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!props.work.board && (
                <FormField
                  control={form.control}
                  name="file"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Final Work</FormLabel>
                      <FormControl onChange={(event) => onUpload(event, field)}>
                        <Input
                          placeholder="File"
                          {...field}
                          type="file"
                          accept="application/pdf"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <FormField
              control={form.control}
              name="place"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Place</FormLabel>
                  <FormControl>
                    <Input placeholder="Place" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {!props.work.board && (
              <div className="w-full flex items-start gap-2">
                <FormField
                  control={form.control}
                  name="member1"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Member 1</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder="Select a member"
                              {...field}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Member 1</SelectLabel>
                              {users.map((user) => (
                                <SelectItem key={user.id} value={user.id!}>
                                  {user.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="member2"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Member 2</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder="Select a member"
                              {...field}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectLabel>Member 2</SelectLabel>
                              {users.map((user) => (
                                <SelectItem key={user.id} value={user.id!}>
                                  {user.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {props.work.board && (
              <>
                <div className="w-full flex flex-col gap-2">
                  <h2 className="text-base font-semibold text-gray-700">
                    Members
                  </h2>
                  <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
                    <div className="flex flex-col gap-2">
                      {props.board!.members.map((member) => (
                        <p key={member}>
                          {allUsers.find((user) => user.id === member)?.name}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="w-full flex flex-col gap-2">
                  <h2 className="text-base font-semibold text-gray-700">
                    Files
                  </h2>

                  <div className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
                    <div className="flex flex-col gap-2">
                      {props.board!.files.map((file) => (
                        <Link
                          href={file.path}
                          target="_blank"
                          passHref
                          key={file.path}
                        >
                          <p className="cursor-pointer text-blue-500">
                            {file.name}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit">
              {props.work.board ? "Update Board" : "Request Board"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
