"use strict";

import Account from "@/components/modules/profile/account/Account";
import Security from "@/components/modules/profile/security/Security";
import { Separator } from "@/components/ui/separator";
import { Info as User } from "@/core/models/User";
import { AuthServices } from "@/core/services/AuthServices";
import { UserServices } from "@/core/services/UserServices";
import { useEffect, useState } from "react";

export default function Profile() {
  const [user, setUser] = useState<User | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("account");

  const authServices = AuthServices();
  const userServices = UserServices();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/";
    }

    const data = authServices.parseJwt(token as string);

    if (data) {
      userServices.fetchUserByAuthId(data.nameid).then(
        (user) => {
          setUser(user);
          setLoading(false);
        },
        (error) => {
          const statusCode = error.response?.status;

          if (statusCode === 404) {
            window.location.href = "/home";
          } else {
            window.location.href = "/";
          }

          setLoading(false);
        }
      );
    } else {
      window.location.href = "/";
    }
  }, []);

  return (
    <div className="w-full mt-8">
      <h1 className="text-4xl font-bold text-gray-700">Profile</h1>

      <Separator className="my-10 h-[1px]" />

      <div className="w-full flex gap-8">
        <div className="w-full h-full max-w-80 flex flex-col gap-2">
          <div
            className={
              "w-full bg-white flex items-center rounded-lg px-6 py-2 hover:bg-slate-100 cursor-pointer transition duration-300" +
              (activeTab === "account" ? " bg-slate-100" : "")
            }
            onClick={() => setActiveTab("account")}
          >
            <p className="text-sm font-medium text-gray-700">Account</p>
          </div>
          <div
            className={
              "w-full bg-white flex items-center rounded-lg px-6 py-2 hover:bg-slate-100 cursor-pointer transition duration-300" +
              (activeTab === "security" ? " bg-slate-100" : "")
            }
            onClick={() => setActiveTab("security")}
          >
            <p className="text-sm font-medium text-gray-700">Security</p>
          </div>
        </div>

        <div className="w-full h-full">
          <div
            className={"w-full" + (activeTab === "account" ? "" : " hidden")}
          >
            <h2 className="text-2xl font-bold text-gray-700">Account</h2>

            <div className="w-full h-full mt-5">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-lg font-medium text-gray-700">
                    Loading...
                  </p>
                </div>
              ) : (
                <Account user={user} />
              )}
            </div>
          </div>

          <div
            className={"w-full" + (activeTab === "security" ? "" : " hidden")}
          >
            <h2 className="text-2xl font-bold text-gray-700">Security</h2>

            <div className="w-full h-full mt-5">
              <Security />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
