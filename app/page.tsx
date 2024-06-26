"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Login from "@/components/shared/login/login";
import Register from "@/components/shared/register/register";

export default function Home() {
  return (
    <div className="w-full h-full min-h-screen flex">
      <div className="w-full bg-zinc-900 shadow-2xl max-md:hidden"></div>
      <div className="max-w-3xl w-full">
        <div className="w-full h-full flex items-center justify-center px-4">
          <Tabs defaultValue="login" className="w-full max-w-md">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">login</TabsTrigger>
              <TabsTrigger value="register">register</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <Login />
            </TabsContent>
            <TabsContent value="register">
              <Register />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

