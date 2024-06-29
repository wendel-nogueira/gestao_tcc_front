import { useApi } from "../hooks/useApi";
import { Organ } from "../models/Organ";

const url = "https://5cd4e4d3fa8bcbbb21cbbcfb21ced38e.loophole.site";

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
    const response = await api.post<Organ>(`${url}/api/crgan`, organ);
    return response.data;
  };

  const updateOrgan = async (organ: Organ) => {
    const response = await api.put<Organ>(`${url}/api/crgan/${organ.id}`, organ);
    return response.data;
  };

  const removeOrgan = async (organ: Organ) => {
    const response = await api.delete<Organ>(`${url}/api/crgan/${organ.id}`);
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
