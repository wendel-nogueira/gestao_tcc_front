"use strict";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { Form, FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { FileServices } from "@/core/services/FileServices";
import { WorkServices } from "@/core/services/WorkServices";
import { useRouter } from "next/router";
import { OrganServices } from "@/core/services/OrganServices";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Info } from "@/core/models/User";
import { useEffect, useState } from "react";
import { UserServices } from "@/core/services/UserServices";

export interface DialogProps {
  organId: string;
  members: string[];
  open: boolean;
  onClose: () => void;
}

export default function DialogMembers({
  organId,
  members,
  open,
  onClose,
}: DialogProps) {
  const [users, setUsers] = useState<Info[]>([]);

  const userServices = UserServices();
  const organServices = OrganServices();

  const router = useRouter();

  const formSchema: any = z.object({
    teacher: z.string().nonempty("Teacher is required"),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  useEffect(() => {
    userServices.fetchUsers().then(
      (users) => {
        const filteredUsers = users.filter(
          (user) => !members.includes(user.id!)
        );
        console.log("Users", filteredUsers);
        setUsers(filteredUsers);
      },
      (error) => {
        console.error(error);
      }
    );
  }, [members]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submitted", values);

    organServices
      .addMember(organId, values.teacher)
      .then((result) => {
        console.log("Member added", result);
        alert("Member added successfully");
        onClose();
      })
      .catch((error) => {
        console.error("Failed to add member", error);
      });
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add version</DialogTitle>
          <DialogDescription>Add a new version to the work</DialogDescription>
        </DialogHeader>
        <div className="w-full">
          <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="teacher"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Teacher</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder="Select a teacher"
                            {...field}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Teacher</SelectLabel>
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

              <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </form>
          </FormProvider>
        </div>
      </DialogContent>
    </Dialog>
  );
}
