"use strict";

import { Course } from "@/core/models/Course";
import { useState, useEffect } from "react";
import api from "axios";
import { useApi } from "../../../../core/hooks/useApi";
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
import { CourseServices } from "@/core/services/CourseServices";

export default function FormCourse() {
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

  const formSchema = z.object({
    name: z.string().nonempty("Name is required"),
    acronym: z.string().nonempty("Acronym is required"),
    coordinator: z.string().nonempty("Coordinator is required"),
    tccCoordinator: z.string().nonempty("Tcc Coordinator is required"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { name, acronym, coordinator, tccCoordinator } = values;

    const course: Course = {
      name,
      acronym,
      coordinator,
      tccCoordinator,
    };

    courseServices
      .createCourse(course)
      .then(() => {
        alert("Course created successfully, plase verify your email");
      })
      .catch((error) => {
        alert("An error occurred");
      });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <Card>
          <CardHeader>
            <CardTitle>Register</CardTitle>
            <CardDescription>
              Fill in the form below to register a new course.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
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
              name="acronym"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Acronym</FormLabel>
                  <FormControl>
                    <Input placeholder="Acronym" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="coordinator"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Coordinator</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Select Coordinator"
                          {...field}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Coordinators</SelectLabel>
                          {teachers.map((teacher: any) => (
                            <SelectItem key={teacher.id} value={teacher.id}>
                              {teacher.name}
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
              name="tccCoordinator"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tcc Coordinator</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Select Tcc Coordinator"
                          {...field}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Coordinators</SelectLabel>
                          {teachers.map((teacher: any) => (
                            <SelectItem key={teacher.id} value={teacher.id}>
                              {teacher.name}
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
          </CardContent>
          <CardFooter>
            <Button type="submit">Register</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
