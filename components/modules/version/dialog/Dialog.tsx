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

export interface DialogProps {
  workId: string;
  open: boolean;
  onClose: () => void;
}

export default function DialogVersion({ workId, open, onClose }: DialogProps) {
  const fileServices = FileServices();
  const workServices = WorkServices();
  const router = useRouter();

  const formSchema: any = z.object({
    name: z.string().nonempty("Name is required"),
    description: z.string().optional().nullable(),
    file: z.string().nonempty("File is required"),
    path: z.string().optional().nullable(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form submitted", values);

    workServices
      .addVersion(workId, values)
      .then((result) => {
        console.log("Version added", result);
        alert("Version added successfully");
        onClose();

        router.push(`/works/${workId}`);
      })
      .catch((error) => {
        console.error("Failed to add version", error);
      });
  }

  function onUpload(event: any) {
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
                name="file"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>File</FormLabel>
                    <FormControl onChange={(event) => onUpload(event)}>
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
