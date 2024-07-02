import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Info } from "@/core/models/User";
import { Work } from "@/core/models/Work";
import { UserServices } from "@/core/services/UserServices";
import { WorkServices } from "@/core/services/WorkServices";
import Link from "next/link";
import { useEffect, useState } from "react";

export interface ViewProps {
  work: Work | undefined;
  loading: boolean;
}

export default function View(props: ViewProps) {
  const [users, setUsers] = useState<Info[]>([]);
  const [loading, setLoading] = useState(true);

  const userServices = UserServices();
  const workServices = WorkServices();

  useEffect(() => {
    userServices.fetchUsers().then(
      (users: Info[]) => {
        setUsers(users);
        setLoading(false);
      },
      (error) => {
        console.error(error);
        setLoading(false);
      }
    );
  }, [props.work]);

  const handleChangeStatus = async (status: number) => {
    if (!props.work || !props.work.id) return;

    workServices.updateStatus(props.work.id, status).then(
      (work: Work) => {
        alert("Status changed successfully");
        window.location.reload();
        console.log(work);
      },
      (error) => {
        alert("An error occurred while changing the status");
        console.error(error);
      }
    );
  };

  return (
    <div>
      {props.loading ? (
        <Skeleton className="w-full h-[400px]" />
      ) : (
        <div className="w-full flex flex-col gap-2">
          <Card>
            <CardHeader>
              <CardTitle>Work Information</CardTitle>
              <CardDescription>
                <div className="w-full flex justify-between">
                  <p>View the information of the work</p>

                  {props.work?.status === 0 && (
                    <div className="flex items-center gap-2">
                      <Button
                        color="primary"
                        onClick={() => handleChangeStatus(1)}
                      >
                        Approve
                      </Button>
                      <Button
                        color="primary"
                        onClick={() => handleChangeStatus(2)}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                  {props.work?.status === 1 && (
                    <div className="flex items-center gap-2">
                      <Button
                        color="primary"
                        onClick={() => handleChangeStatus(6)}
                      >
                        Approve
                      </Button>
                      <Button
                        color="primary"
                        onClick={() => handleChangeStatus(5)}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="w-full flex flex-col gap-2">
                <h2 className="text-base font-semibold text-gray-700">Title</h2>
                <p className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
                  {props.work?.title}
                </p>
              </div>
              <div className="w-full flex flex-col gap-2">
                <h2 className="text-base font-semibold text-gray-700">
                  Knowledge Area
                </h2>
                <p className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
                  {props.work?.knowledgeArea}
                </p>
              </div>
              <div className="w-full flex flex-col gap-2">
                <h2 className="text-base font-semibold text-gray-700">
                  Abstract
                </h2>
                <p className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
                  {props.work?.abstract}
                </p>
              </div>
              <div className="w-full flex flex-col gap-2">
                <h2 className="text-base font-semibold text-gray-700">
                  Keywords
                </h2>
                <p className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
                  {props.work?.keywords}
                </p>
              </div>
              <div className="w-full flex flex-col gap-2">
                <h2 className="text-base font-semibold text-gray-700">
                  Advisor
                </h2>
                <p className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
                  {users.find((user) => user.id === props.work?.advisor)?.name}
                </p>
              </div>
              {props.work?.coadvisor && (
                <div className="w-full flex flex-col gap-2">
                  <h2 className="text-base font-semibold text-gray-700">
                    Coadvisor
                  </h2>
                  <p className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
                    {
                      users.find((user) => user.id === props.work?.coadvisor)
                        ?.name
                    }
                  </p>
                </div>
              )}
              <div className="w-full flex flex-col gap-2">
                <h2 className="text-base font-semibold text-gray-700">
                  Student
                </h2>
                <p className="bg-slate-50 px-4 py-2 rounded-lg border border-slate-200">
                  {users.find((user) => user.id === props.work?.student)?.name}
                </p>
              </div>
              <div className="w-full flex flex-col gap-2">
                <h2 className="text-base font-semibold text-gray-700">
                  Request Form
                </h2>

                <Link
                  href={props.work?.requestForm || ""}
                  target="_blank"
                  passHref
                >
                  <p className="cursor-pointer text-blue-500">
                    View Request Form
                  </p>
                </Link>
              </div>
              <div className="w-full flex flex-col gap-2">
                <h2 className="text-base font-semibold text-gray-700">
                  Record Form
                </h2>

                <Link
                  href={props.work?.recordForm || ""}
                  target="_blank"
                  passHref
                >
                  <p className="cursor-pointer text-blue-500">
                    View Record Form
                  </p>
                </Link>
              </div>
              <div className="w-full flex flex-col gap-2">
                <h2 className="text-base font-semibold text-gray-700">Edict</h2>

                <Link
                  href={`/edicts/${props.work?.edictId}`}
                  target="_blank"
                  passHref
                >
                  <p className="cursor-pointer text-blue-500">View Edict</p>
                </Link>
              </div>
            </CardContent>
            <CardFooter></CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
