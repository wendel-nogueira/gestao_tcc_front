import { useEffect, useState } from "react";
import { AuthServices } from "@/core/services/AuthServices";
import Account from "@/components/modules/profile/account/Account";
import { UserServices } from "@/core/services/UserServices";
import { Info } from "@/core/models/User";

export default function Home() {
  const [toAdd, setToAdd] = useState<
    | {
        authId: string;
        role: string;
      }
    | undefined
  >(undefined);
  const [add, setAdd] = useState(false);
  const [loading, setLoading] = useState(true);

  const authServices = AuthServices();
  const userServices = UserServices();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/";
    }

    const data = authServices.parseJwt(token as string);

    if (data) {
      setToAdd({
        authId: data.nameid,
        role: data.role,
      });

      if (data.role === "Admin") {
        setLoading(false);
        return
      }

      userServices.fetchUserByAuthId(data.nameid).then(
        (user: Info) => {
          if (!user && data.role !== "Admin") {
            setAdd(true);
          }

          setLoading(false);
        },
        (error) => {
          const statusCode = error.response?.status;

          if (statusCode === 404) {
            setAdd(true);
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
    <>
      <div className="flex flex-col items-center justify-center w-full mt-52">
        <h1 className="text-4xl font-bold text-center text-gray-600">
          Welcome to the TCC Management System
        </h1>
        <p className="font-normal text-lg text-center text-gray-500">
          This is the TCC Management System. You can manage your works here.
        </p>
      </div>
      {add && toAdd && !loading && (
        <div className="w-full h-full z-10 bg-black bg-opacity-50 fixed top-0 left-0 flex items-center justify-center">
          <Account toAdd={toAdd} />
        </div>
      )}
    </>
  );
}
