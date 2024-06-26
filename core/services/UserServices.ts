import { useApi } from "../hooks/useApi";
import { Info } from "../models/User";

export function UserServices() {
  const api = useApi();

  const fetchUsers = async () => {
    const response = await api.get<Info[]>("/api/users");
    return response.data;
  };

  const fetchUser = async (id: string) => {
    const response = await api.get<Info>(`/api/users/${id}`);
    return response.data;
  };

  const createUser = async (user: Info) => {
    const response = await api.post<Info>("/api/users", user);
    return response.data;
  };

  const updateUser = async (user: Info) => {
    const response = await api.put<Info>(`/api/users/${user.id}`, user);
    return response.data;
  };

  const activateUser = async (id: string) => {
    const response = await api.patch<Info>(`/api/users/${id}/activate`);
    return response.data;
  };

  const deactivateUser = async (id: string) => {
    const response = await api.patch<Info>(`/api/users/${id}/deactivate`);
    return response.data;
  };

  return {
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    activateUser,
    deactivateUser,
  };
}
