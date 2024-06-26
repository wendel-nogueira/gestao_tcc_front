import { useApi } from "../hooks/useApi";
import { User } from "../models/User";

const url = "http://localhost:5257";

export function AuthServices() {
  const api = useApi();

  const fetchUsers = async () => {
    const response = await api.get<User[]>(`${url}/api/authentication`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  };

  const fetchUser = async (id: string) => {
    const response = await api.get<User>(`${url}/api/authentication/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  };

  const createUser = async (user: User) => {
    const response = await api.post<User>(`${url}/api/authentication`, user);
    return response.data;
  };

  const updateUser = async (user: User) => {
    const response = await api.put<User>(
      `${url}/api/authentication/${user.id}`,
      user,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    return response.data;
  };

  const deleteUser = async (id: string) => {
    const response = await api.delete<User>(`${url}/api/authentication/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    return response.data;
  };

  const login = async (email: string, password: string) => {
    const response = await api.post<{ token: string }>(
      `${url}/api/authentication/login`,
      {
        email,
        password,
      }
    );
    return response.data;
  };

  const logout = async () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  const requestPasswordReset = async (email: string) => {
    const response = await api.get<User>(
      `${url}/api/authentication/forgot-password?email=${email}`
    );
    return response.data;
  };

  const resetPassword = async (
    token: string,
    newPassword: string,
    repeatNewPassword: string
  ) => {
    const response = await api.post<User>(
      `${url}/api/authentication/reset-password`,
      {
        token,
        newPassword,
        repeatNewPassword,
      }
    );
    return response.data;
  };

  const changeEmail = async (token: string, email: string) => {
    const response = await api.post<User>(
      `${url}/api/authentication/change-email`,
      {
        token,
        email,
      }
    );
    return response.data;
  };

  return {
    fetchUsers,
    fetchUser,
    createUser,
    updateUser,
    deleteUser,
    login,
    logout,
    requestPasswordReset,
    resetPassword,
    changeEmail,
  };
}
