import { useApi } from "../hooks/useApi";
import { Edict } from "../models/Edict";

const url = "https://works.yelluh.xyz";

export function EdictServices() {
  const api = useApi();

  const fetchEdict = async (id: string) => {
    const response = await api.get<Edict>(`${url}/api/edict/${id}`);
    return response.data;
  };

  const createEdict = async (courseId: string, edict: Edict) => {
    const response = await api.post<Edict>(
      `${url}/api/course/${courseId}/edict`,
      edict
    );
    return response.data;
  };

  const updateEdict = async (edict: Edict) => {
    const response = await api.put<Edict>(
      `${url}/api/edict/${edict.id}`,
      edict
    );
    return response.data;
  };

  const removeEdict = async (courseId: string, edict: Edict) => {
    const response = await api.delete<Edict>(
      `${url}/api/course/${courseId}/edict/${edict.id}`
    );
    return response.data;
  };

  return {
    fetchEdict,
    createEdict,
    updateEdict,
    removeEdict,
  };
}
