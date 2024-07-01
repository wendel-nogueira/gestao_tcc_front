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
import { UserServices } from "@/core/services/UserServices";
import { Info } from "@/core/models/User";

export interface FormCourseProps {
  course?: Course;
}

export default function FormCourse(props: FormCourseProps) {
  const courseServices = CourseServices();
  const [teachers, setTeachers] = useState<Info[]>([]);
  const [course, setCourse] = useState<Course | undefined>(props.course);

  const userService = UserServices();

  const formSchema = z.object({
    name: z.string().nonempty("Name is required"),
    acronym: z.string().nonempty("Acronym is required"),
    coordinator: z.string().nonempty("Coordinator is required"),
    tccCoordinator: z.string().nonempty("Tcc Coordinator is required"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    userService
      .fetchUsers()
      .then((users) => {
        const filteredTeachers = users.filter(
          (user: any) => user.role === "Teacher"
        );

        setTeachers(filteredTeachers);
      })
      .catch((error) => {
        console.error("Failed to fetch teachers", error);
      });
  }, []);

  useEffect(() => {
    if (props.course) setCourse(props.course);
  }, [props.course]);

  useEffect(() => {
    if (!course) return;

    form.reset({
      name: course.name,
      acronym: course.acronym,
      coordinator: course.coordinator,
      tccCoordinator: course.tccCoordinator,
    });

    formSchema.parse({
      name: course.name,
      acronym: course.acronym,
      coordinator: course.coordinator,
      tccCoordinator: course.tccCoordinator,
    });
  }, [course]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { name, acronym, coordinator, tccCoordinator } = values;

    let newCourse: Course = {
      name,
      acronym,
      coordinator,
      tccCoordinator,
    };

    if (course) {
      newCourse = {
        ...newCourse,
        id: course.id!,
      };
    }

    if (course) {
      courseServices
        .updateCourse(newCourse)
        .then(() => {
          alert("Course updated successfully");
        })
        .catch((error) => {
          alert("An error occurred");
        });

      return;
    } else {
      courseServices
        .createCourse(newCourse)
        .then(() => {
          alert("Course created successfully, plase verify your email");
        })
        .catch((error) => {
          alert("An error occurred");
        });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <Card>
          <CardHeader>
            <CardTitle>{course ? "Edit" : "Register"}</CardTitle>
            <CardDescription>
              {course
                ? "Update the course information"
                : "Fill in the fields to register a new course"}
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
            <Button type="submit">{course ? "Update" : "Register"}</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
