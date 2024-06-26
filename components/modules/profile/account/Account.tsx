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
import { User } from "@/core/models/User";
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
import { Separator } from "@radix-ui/react-select";
import { useEffect } from "react";

export default function Account() {
  let userType: string = "external";

  const formSchema = z.object({
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
  });

  useEffect(() => {
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
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { name, cpf, birthDate, sex } = values;

    console.log();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <Card>
          <CardHeader>
            <CardTitle>Update Information</CardTitle>
            <CardDescription>Update your account information</CardDescription>
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
