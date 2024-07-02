import { useEffect, useState } from "react";
import { AuthServices } from "@/core/services/AuthServices";
import Register from "@/components/shared/register/register";

export default function Create() {
  const authServices = AuthServices();

  const [loading, setLoading] = useState(true);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

  useEffect(() => {
    const verifyUserRole = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        window.location.href = "/";
        return;
      }

      const data = authServices.parseJwt(token as string);
      setCurrentUserRole(data.role);
      setLoading(false);
    };

    verifyUserRole();
  }, [authServices]);

  if (loading) {
    return <div>Loading...</div>; // Ou qualquer indicador de carregamento
  }

  if (currentUserRole !== "Admin") {
    return <div>Acesso negado. Apenas administradores podem ver esta página.</div>;
  }

  return (
    <div className="flex flex-col space-y-8 w-full max-w-md mx-auto mt-32">
      <div className="flex flex-col space-y-2 text-center">
        <h2 className="text-2xl font-bold text-gray-600">Create User</h2>
        <p className="text-gray-500 text-sm font-normal">
          Create a new user account. You can choose the role of the user.
        </p>
      </div>
      <Register roles={["Teacher", "Admin"]} />
    </div>
  );
}
