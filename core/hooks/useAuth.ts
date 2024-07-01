import { useEffect, useState } from "react";

export function useAuth() {
  const [token, setToken] = useState<string | undefined>(undefined);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) setToken(token);
  }, []);

  return {
    token,
    setToken,
  };
}
