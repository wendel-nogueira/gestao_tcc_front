import { useEffect, useState } from "react";

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setToken(token);
  }, []);

  return {
    token,
    setToken,
  };
}
