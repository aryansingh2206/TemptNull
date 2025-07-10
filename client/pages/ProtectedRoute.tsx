// client/pages/ProtectedRoute.tsx
import { Navigate } from "react-router-dom";
import { isTokenValid } from "@/lib/auth";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem("token");

  if (!token || !isTokenValid()) {
    // clear expired token
    localStorage.removeItem("token");
    localStorage.removeItem("auth");
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
