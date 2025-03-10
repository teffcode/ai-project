import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem("auth");
    if (auth !== "true") {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) return <div>Loading...</div>;

  return <div className="flex flex-col items-center min-h-screen">{children}</div>;
}
