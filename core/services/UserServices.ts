import { useApi } from "../hooks/useApi";
import { Info } from "../models/User";

const url = "https://042d5ba28237544aeee54f79addd0235.loophole.site";

export function UserServices() {
  const api = useApi();

  const fetchUsers = async () => {
    const response = await api.get<Info[]>(`${url}/api/users`);
    return response.data;
  };

  const fetchUser = async (id: string) => {
    const response = await api.get<Info>(`${url}/api/users/${id}`);
    return response.data;
  };

  const fetchUserByAuthId = async (authId: string) => {
    const response = await api.get<Info>(`${url}/api/users/auth/${authId}`);
    return response.data;
  }

  const createUser = async (user: Info) => {
    const response = await api.post<Info>(`${url}/api/users`, user);
    return response.data;
  };

  const updateUser = async (user: Info) => {
    const response = await api.put<Info>(`${url}/api/users/${user.id}`, user);
    return response.data;
  };

  const activateUser = async (id: string) => {
    const response = await api.patch<Info>(`${url}/api/users/${id}/activate`);
    return response.data;
  };

  const deactivateUser = async (id: string) => {
    const response = await api.patch<Info>(`${url}/api/users/${id}/deactivate`);
    return response.data;
  };

  return {
    fetchUsers,
    fetchUser,
    fetchUserByAuthId,
    createUser,
    updateUser,
    activateUser,
    deactivateUser,
  };
}
