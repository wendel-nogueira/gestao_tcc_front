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

export default function Security() {
  const formSchemaEmail = z.object({
    email: z.string().nonempty("Email is required"),
    repeatEmail: z.string().nonempty("Repeat Email is required"),
  });

  const formSchemaPassword = z.object({
    password: z.string().nonempty("Password is required"),
    repeatPassword: z.string().nonempty("Repeat Password is required"),
  });

  const formEmail = useForm<z.infer<typeof formSchemaEmail>>({
    resolver: zodResolver(formSchemaEmail),
  });

  const formPassword = useForm<z.infer<typeof formSchemaPassword>>({
    resolver: zodResolver(formSchemaPassword),
  });

  function onSubmitEmail(values: z.infer<typeof formSchemaEmail>) {
    const { email, repeatEmail } = values;

    console.log(email, repeatEmail);
  }

  function onSubmitPassword(values: z.infer<typeof formSchemaPassword>) {
    const { password, repeatPassword } = values;

    console.log(password, repeatPassword);
  }

  return (
    <div className="w-full h-full flex flex-col gap-6">
      <Form {...formEmail}>
        <form
          onSubmit={formEmail.handleSubmit(onSubmitEmail)}
          className="space-y-2"
        >
          <Card>
            <CardHeader>
              <CardTitle>Update Email</CardTitle>
              <CardDescription>Update your email address</CardDescription>
            </CardHeader>
            <CardContent className="w-full flex flex-row gap-4">
              <FormField
                control={formEmail.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formEmail.control}
                name="repeatEmail"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Repeat Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Repeat Email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="ml-auto">
                Update Email
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>

      <Form {...formPassword}>
        <form
          onSubmit={formPassword.handleSubmit(onSubmitPassword)}
          className="space-y-2"
        >
          <Card>
            <CardHeader>
              <CardTitle>Update Password</CardTitle>
              <CardDescription>Update your password</CardDescription>
            </CardHeader>
            <CardContent className="w-full flex flex-row gap-4">
              <FormField
                control={formPassword.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Password"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={formPassword.control}
                name="repeatPassword"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Repeat Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Repeat Password"
                        {...field}
                        type="password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" className="ml-auto">
                Update Password
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
