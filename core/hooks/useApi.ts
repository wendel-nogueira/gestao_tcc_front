import axios from "axios";
import { useAuth } from "./useAuth";

export function useApi() {
  const { token } = useAuth();
  const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return api;
}
