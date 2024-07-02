import { useSelector } from "react-redux";
import { useEffect } from "react";

import { useRouter } from "next/navigation";
const useAuth = () => {
  const router = useRouter();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  return isAuthenticated;
};

export default useAuth;
