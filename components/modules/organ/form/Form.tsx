"use strict";

import { Organ } from "@/core/models/Organ";
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
import { Textarea } from "@/components/ui/textarea";
import { OrganServices } from "@/core/services/OrganServices";
import { CourseServices } from "@/core/services/CourseServices";
import { Course } from "@/core/models/Course";

export interface OrganFormProps {
  organ?: Organ;
}

export default function FormOrgan({ organ }: OrganFormProps) {
  const organServices = OrganServices();
  const [courses, setCourses] = useState<Course[]>([]);

  const courseServices = CourseServices();

  useEffect(() => {
    courseServices
      .fetchCourses()
      .then((courses) => {
        console.log(courses);
        setCourses(courses);
      })
      .catch((error) => {
        console.error("Failed to fetch courses", error);
      });
  }, []);

  const formSchema = z.object({
    name: z.string().nonempty("Name is required"),
    acronym: z.string().nonempty("Acronym is required"),
    description: z.string().optional(),
    course: z.any().optional().nullable(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    if (organ) {
      form.reset({
        name: organ.name,
        acronym: organ.acronym,
        description: organ.description,
        course: organ.courseId,
      });
    }
  }, [organ]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { name, acronym, description, course } = values;

    let newOrgan: Organ = {
      name,
      acronym,
      description: description || "",
      courseId: course,
      teachers: [],
    };

    if (organ) {
      newOrgan = {
        ...newOrgan,
        id: organ.id,
      };
    }

    if (organ) {
      return organServices
        .updateOrgan(newOrgan)
        .then(() => {
          alert("Organ updated successfully");
        })
        .catch((error) => {
          alert("An error occurred");
        });
    } else {
      return organServices
        .createOrgan(newOrgan)
        .then(() => {
          alert("Organ created successfully, plase verify your email");
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
            <CardTitle>{organ ? "Edit" : "Register"}</CardTitle>
            <CardDescription>
              {organ
                ? "Fill in the form below to edit an organ."
                : "Fill in the form below to register a new organ."}
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
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="course"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Course" {...field} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Course</SelectLabel>
                          {courses.map((course: Course) => (
                            <SelectItem key={course.id} value={course.id!}>
                              {course.name}
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
            <Button type="submit">{organ ? "Update" : "Register"}</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
