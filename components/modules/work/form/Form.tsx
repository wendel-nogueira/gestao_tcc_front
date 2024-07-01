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

export default function FormWork() {
  const [edictId, setEdictId] = useState<string | undefined>(undefined);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [users, setUsers] = useState<Info[]>([]);

  const authServices = AuthServices();
  const userServices = UserServices();
  const fileServices = FileServices();
  const workServices = WorkServices();
  const router = useRouter();

  const formSchema: any = z.object({
    title: z.string().nonempty("Title is required"),
    knowledgeArea: z.string().nonempty("Knowledge Area is required"),
    abstract: z.string().nonempty("Abstract is required"),
    keywords: z.string().nonempty("Keywords is required"),
    advisor: z.string().nonempty("Advisor is required"),
    coadvisor: z.string().optional().nullable(),
    requestFormFile: z.string().nonempty("Request Form is required"),
    recordFormFile: z.string().nonempty("Record Form is required"),
    requestForm: z.string().optional().nullable(),
    recordForm: z.string().optional().nullable(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    const { edictId } = router.query;

    if (edictId) {
      setEdictId(edictId as string);
    }
  }, [router.query]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/");
    }

    const data = authServices.parseJwt(token!);

    if (data) {
      const id = data.nameid;

      userServices.fetchUserByAuthId(id).then(
        (user) => {
          setUserId(user.id);
        },
        () => {
          router.push("/");
        }
      );
    }
  }, []);

  useEffect(() => {
    userServices
      .fetchUsers()
      .then((users) => {
        const usersInfo = users.filter(
          (user) => user.role === "Teacher" || user.role === "External"
        );

        setUsers(usersInfo);
      })
      .catch((error) => {
        console.error("Failed to fetch users", error);
      });
  }, []);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submitted", values);

    if (!edictId || !userId) {
      console.error("Edict or User not found");
      return;
    }

    const work = {
      title: values.title,
      knowledgeArea: parseInt(values.knowledgeArea),
      abstract: values.abstract,
      keywords: values.keywords,
      advisor: values.advisor,
      coadvisor: values.coadvisor,
      requestForm: values.requestForm,
      recordForm: values.recordForm,
      edictId: edictId,
      student: userId,
    } as Work;

    workServices
      .createWork(work)
      .then((work) => {
        console.log("Work created", work);
        alert("Work created successfully");
        router.push("/works");
      })
      .catch((error) => {
        console.error("Failed to create work", error);
      });
  }

  function onUpload(event: any, field: any) {
    const file = event.target.files[0];

    const formResult = {
      requestFormFile: "requestForm",
      recordFormFile: "recordForm",
    };

    fileServices
      .uploadFile(file)
      .then((result) => {
        const path = result.uri;
        const fieldName = field.name;

        console.log("File uploaded", path, fieldName);
        form.setValue(formResult[fieldName as keyof typeof formResult], path);
      })
      .catch((error) => {
        console.error("Failed to upload file", error);
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>
              Fill the form to register a new work to the system.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="knowledgeArea"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Knowledge Area</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Select Knowledge Area"
                          {...field}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Areas</SelectLabel>
                          {areas.map((area) => (
                            <SelectItem key={area.value} value={area.value}>
                              {area.label}
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
              name="abstract"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Abstract</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Abstract" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="keywords"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Keywords</FormLabel>
                  <FormControl>
                    <Input placeholder="Keywords" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="advisor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Advisor</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Advisor" {...field} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Users</SelectLabel>
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
              name="coadvisor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coadvisor</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Select Coadvisor"
                          {...field}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Users</SelectLabel>
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
              name="requestFormFile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Request Form</FormLabel>
                  <FormControl onChange={(event) => onUpload(event, field)}>
                    <Input
                      placeholder="Request Form"
                      {...field}
                      type="file"
                      accept="application/pdf"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="recordFormFile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Record Form</FormLabel>
                  <FormControl onChange={(event) => onUpload(event, field)}>
                    <Input
                      placeholder="Record Form"
                      {...field}
                      type="file"
                      accept="application/pdf"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit">Register</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

const areas = [
  { value: "0", label: "Administration" },
  { value: "1", label: "Human Aspects" },
  { value: "2", label: "Software Development" },
  { value: "3", label: "Computation Mathematics" },
  { value: "4", label: "Computation Methods" },
  { value: "5", label: "Data Persistence" },
  { value: "6", label: "Networks" },
  { value: "7", label: "Computation Theory" },
];
