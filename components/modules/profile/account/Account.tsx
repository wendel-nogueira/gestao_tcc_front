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
import { AuthServices } from "@/core/services/AuthServices";
import { Info as User } from "@/core/models/User";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "@radix-ui/react-icons";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState } from "react";
import { UserServices } from "@/core/services/UserServices";

export interface AccountProps {
  user?: User;
  toAdd?: {
    authId: string;
    role: string;
  };
}

export default function Account(props: AccountProps) {
  const [toAdd, setToAdd] = useState<
    | {
        authId: string;
        role: string;
      }
    | undefined
  >(undefined);
  const [userType, setUserType] = useState<string | undefined>(undefined);
  const [user, setUser] = useState<User | undefined>(undefined);
  const userServices = UserServices();

  const formSchema = z
    .object({
      name: z.string().nonempty("Name is required"),
      cpf: z.string().nonempty("CPF is required"),
      birthDate: z.date().refine((date) => {
        return date < new Date() && date > new Date("1900-01-01");
      }, "Invalid date"),
      sex: z.enum(["Male", "Female", "Non-binary", "Other", "Not-to-say"]),
      registration: z.string().optional(),
      course: z.string().optional(),
      admissionDate: z.date().optional(),
      graduationDate: z.date().optional(),
      siape: z.string().optional(),
      area: z.string().optional(),
      institution: z.string().optional(),
      formation: z.string().optional(),
    })
    .strict();

  useEffect(() => {
    if (props.user) {
      console.log(props.user);
      setUser(props.user);
    }
  }, [props.user]);

  useEffect(() => {
    if (props.toAdd) {
      setToAdd(props.toAdd);
      setUserType(props.toAdd.role.toLowerCase());
      completeFields();
    }
  }, [props.toAdd]);

  useEffect(() => {
    if (user) {
      setUserType((user.role as string).toLowerCase());
      completeFields();

      form.setValue("name", user.name);
      form.setValue("cpf", user.cpf);
      form.setValue("birthDate", new Date(user.birthDate));
      form.setValue("sex", "Male");

      if (user.student) {
        form.setValue("registration", user.student.registration);
        form.setValue("course", user.student.course);
        form.setValue("admissionDate", new Date(user.student.admissionDate));
        form.setValue("graduationDate", new Date(user.student.graduationDate));
      } else if (user.teacher) {
        form.setValue("siape", user.teacher.siape);
        form.setValue("area", user.teacher.area);
      } else if (user.external) {
        form.setValue("institution", user.external.institution);
        form.setValue("formation", user.external.formation);
        form.setValue("area", user.external.area);
      }
    }
  }, [user]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function completeFields() {
    if (userType === "student") {
      formSchema.extend({
        registration: z.string().nonempty("Registration is required"),
        course: z.string().nonempty("Course is required"),
        admissionDate: z.date().nullable(),
        graduationDate: z.date().nullable(),
      });
    } else if (userType === "teacher") {
      formSchema.extend({
        siape: z.string().nonempty("SIAPE is required"),
        area: z.string().nonempty("Area is required"),
      });
    } else if (userType === "external") {
      formSchema.extend({
        institution: z.string().nonempty("Institution is required"),
        formation: z.string().nonempty("Formation is required"),
        area: z.string().nonempty("Area is required"),
      });
    }
  }

  function onSubmit(values: z.infer<typeof formSchema>) {
    let userToUpdate = {
      name: values.name,
      cpf: values.cpf,
      birthDate: values.birthDate.toISOString(),
      sex: values.sex,
    } as any;

    if (toAdd) {
      userToUpdate = {
        ...userToUpdate,
        authId: toAdd.authId,
        role: toAdd.role,
      };
    } else {
      userToUpdate = {
        ...userToUpdate,
        id: user?.id,
      };
    }

    const student =
      (userType === "student" && {
        registration: values.registration,
        course: values.course,
        admissionDate: values.admissionDate,
        graduationDate: values.graduationDate,
      }) ||
      null;

    const teacher =
      (userType === "teacher" && {
        siape: values.siape,
        area: values.area,
      }) ||
      null;

    const external =
      (userType === "external" && {
        institution: values.institution,
        formation: values.formation,
        area: values.area,
      }) ||
      null;

    userToUpdate = {
      ...userToUpdate,
      student,
      teacher,
      external,
    };

    console.log(userToUpdate);

    if (toAdd) {
      userServices.createUser(userToUpdate).then((response) => {
        console.log(response);

        window.alert("User updated successfully");
      });
    } else {
      userServices.updateUser(userToUpdate).then((response) => {
        console.log(response);

        window.alert("User updated successfully");
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <Card>
          <CardHeader>
            <CardTitle>
              {toAdd
                ? "Complete Information"
                : user
                ? "Update Information"
                : "Create Account"}
            </CardTitle>
            <CardDescription>
              {toAdd
                ? "Complete your information to continue"
                : user
                ? "Update your information"
                : "Create your account"}
            </CardDescription>
          </CardHeader>
          <CardContent className="w-full grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="cpf"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>CPF</FormLabel>
                  <FormControl>
                    <Input placeholder="CPF" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem className="w-full flex flex-col mt-1">
                  <FormLabel className="mb-[6px]">Birth Date</FormLabel>
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
              name="sex"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Sex</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Sex" {...field} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Sex</SelectLabel>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Non-binary">Non-binary</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                          <SelectItem value="Not-to-say">
                            Prefer not to say
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {userType === "student" && (
              <>
                <FormField
                  control={form.control}
                  name="registration"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Registration</FormLabel>
                      <FormControl>
                        <Input placeholder="Registration" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="course"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Course</FormLabel>
                      <FormControl>
                        <Input placeholder="Course" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="admissionDate"
                  render={({ field }) => (
                    <FormItem className="w-full flex flex-col mt-1">
                      <FormLabel className="mb-[6px]">Admission Date</FormLabel>
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
                  name="graduationDate"
                  render={({ field }) => (
                    <FormItem className="w-full flex flex-col mt-1">
                      <FormLabel className="mb-[6px]">
                        Graduation Date
                      </FormLabel>
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
              </>
            )}

            {userType === "teacher" && (
              <>
                <FormField
                  control={form.control}
                  name="siape"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>SIAPE</FormLabel>
                      <FormControl>
                        <Input placeholder="SIAPE" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Area</FormLabel>
                      <FormControl>
                        <Input placeholder="Area" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {userType === "external" && (
              <>
                <FormField
                  control={form.control}
                  name="institution"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Institution</FormLabel>
                      <FormControl>
                        <Input placeholder="Institution" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="formation"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Formation</FormLabel>
                      <FormControl>
                        <Input placeholder="Formation" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Area</FormLabel>
                      <FormControl>
                        <Input placeholder="Area" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="ml-auto">
              Update Information
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
