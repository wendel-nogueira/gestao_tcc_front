import { useApi } from "../hooks/useApi";

const url = "http://3.227.175.217:8086";

export function FileServices() {
  const api = useApi();

  const uploadFile = async (file: File) => {
    const formData = new FormData();
    formData.append("inputFile", file);

    const response = await api.post<{
      content: string;
      contentType: string;
      name: string;
      size: number;
      uri: string;
    }>(`${url}/api/files`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  };

  return {
    uploadFile,
  };
}
