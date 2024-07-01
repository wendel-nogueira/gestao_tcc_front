import { useApi } from "../hooks/useApi";
import { Board } from "../models/Board";
import { Version } from "../models/Version";
import { Work } from "../models/Work";

const url = "http://3.227.175.217:8083";

export function WorkServices() {
  const api = useApi();

  const fetchWorks = async () => {
    const response = await api.get<Work[]>(`${url}/api/work`);
    return response.data;
  };

  const fetchWork = async (id: string) => {
    const response = await api.get<Work>(`${url}/api/work/${id}`);
    return response.data;
  };

  const createWork = async (work: Work) => {
    const response = await api.post<Work>(`${url}/api/work`, work);
    return response.data;
  };

  const updateWork = async (work: Work) => {
    const response = await api.put<Work>(`${url}/api/work/${work.id}`, work);
    return response.data;
  };

  const removeWork = async (work: Work) => {
    const response = await api.delete<Work>(`${url}/api/work/${work.id}`);
    return response.data;
  };

  const addVersion = async (workId: string, version: Version) => {
    const response = await api.post<Version>(
      `${url}/api/work/${workId}/version`,
      version
    );
    return response.data;
  };

  const addBoard = async (workId: string, board: Board) => {
    const response = await api.post<Board>(
      `${url}/api/work/${workId}/board`,
      board
    );
    return response.data;
  };

  const updateBoard = async (workId: string, board: Board) => {
    const response = await api.put<Board>(`${url}/api/board/${workId}`, board);
    return response.data;
  };

  return {
    fetchWorks,
    fetchWork,
    createWork,
    updateWork,
    removeWork,
    addVersion,
    addBoard,
    updateBoard,
  };
}
