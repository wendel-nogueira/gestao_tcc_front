import { useApi } from "../hooks/useApi";
import { Organ } from "../models/Organ";

const url = "http://3.227.175.217:8083";

export function OrganServices() {
  const api = useApi();

  const fetchOrgans = async () => {
    const response = await api.get<Organ[]>(`${url}/api/organ`);
    return response.data;
  };

  const fetchOrgan = async (id: string) => {
    const response = await api.get<Organ>(`${url}/api/organ/${id}`);
    return response.data;
  };

  const createOrgan = async (organ: Organ) => {
    const response = await api.post<Organ>(`${url}/api/organ`, organ);
    return response.data;
  };

  const updateOrgan = async (organ: Organ) => {
    const response = await api.put<Organ>(`${url}/api/organ/${organ.id}`, organ);
    return response.data;
  };

  const removeOrgan = async (id: string) => {
    const response = await api.delete<Organ>(`${url}/api/organ/${id}`);
    return response.data;
  };



  return {
    fetchOrgans,
    fetchOrgan,
    createOrgan,
    updateOrgan,
    removeOrgan,
  };
}
