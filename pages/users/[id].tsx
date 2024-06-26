import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { User as UserIcon } from "@phosphor-icons/react";
import { Separator } from "@/components/ui/separator";
import { User, Info, Role } from "@/core/models/User";
import { AuthServices } from "@/core/services/AuthServices";

export default function Edit() {
  const authServices = AuthServices();

  const router = useRouter();
  const { id } = router.query;
  const [user, setUser] = useState({} as User);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        const user = await authServices
          .fetchUser(id as string)
          .catch((error) => {
            console.error(error);
            return {} as User;
          });

        setLoading(false);

        if (!user || !user.id) return;

        setUser(user);
      };

      fetchUser();
    }
  }, [authServices, id]);

  useEffect(() => {
    if (id) {
      console.log(`Editing user: ${id}`);
    }
  }, [id]);

  return (
    <>
      {user.id && !loading ? (
        <div className="flex flex-col gap-2">
          <div className="w-full h-full mt-20 rounded px-10 py-6 pt-12 border border-slate-100 bg-zinc-50 shadow-sm relative">
            <div className="flex flex-col items-center justify-center gap-2">
              <div className="w-20 h-20 absolute -top-10 left-[calc(50%-40px)] rounded-full flex items-center justify-center bg-white border border-slate-100 text-slate-500">
                <UserIcon size={32} weight="light" />
              </div>
              <h1 className="text-2xl font-semibold text-gray-600">
                {user.email}
              </h1>
              <p className="text-sm text-gray-400 font-regular">
                {(user.role as Role).name}
              </p>
            </div>

            <Separator className="my-6" />

            {user.userInfo && (
              <>
                <h2 className="text-lg font-semibold text-gray-600 mb-4">
                  Personal Information
                </h2>

                <div className="flex flex-col gap-1">
                  {Object.keys(user.userInfo!).map((key: any) => {
                    if (
                      key !== "student" &&
                      key !== "teacher" &&
                      key !== "external" &&
                      key !== "isActive"
                    ) {
                      return (
                        <p
                          className="text-sm text-gray-500 font-medium"
                          key={key}
                        >
                          <span className="font-semibold text-gray-600">
                            {fields[key as keyof typeof fields]}:
                          </span>{" "}
                          {user.userInfo![key as keyof Info] as string}
                        </p>
                      );
                    }
                  })}

                  {Object.keys(
                    user.userInfo![
                      (user.role as Role).name.toLowerCase() as keyof Info
                    ] as any
                  ).map((key: any) => {
                    return (
                      <p
                        className="text-sm text-gray-500 font-medium"
                        key={key}
                      >
                        <span className="font-semibold text-gray-600">
                          {fields[key as keyof typeof fields]}:
                        </span>{" "}
                        {
                          (
                            user.userInfo![
                              (
                                user.role as Role
                              ).name.toLowerCase() as keyof Info
                            ] as any
                          )[key as keyof typeof fields]
                        }
                      </p>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4">
          <h1 className="text-2xl font-semibold text-gray-600">
            User not found
          </h1>
          <p className="text-sm text-gray-400 font-regular">
            The user with ID {id} was not found
          </p>
        </div>
      )}
    </>
  );
}

const fields = {
  name: "Name",
  cpf: "CPF",
  birthDate: "Birth Date",
  sex: "Sex",
  isActive: "Active",
  registration: "Registration",
  course: "Course",
  admissionDate: "Admission Date",
  graduationDate: "Graduation Date",
  siape: "SIAPE",
  area: "Area",
  institution: "Institution",
  formation: "Formation",
};
