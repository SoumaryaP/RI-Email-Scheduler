import { useEffect, useState } from "react";
import Cookies from "js-cookie";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = Cookies.get("token");
    setIsAuthenticated(!!token);
  }, []);

  return { isAuthenticated };
}
