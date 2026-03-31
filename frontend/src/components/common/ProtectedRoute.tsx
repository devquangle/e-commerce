import { useAuth } from "@/context/useAuth";
import { Navigate, useLocation } from "react-router-dom";
import type { RoleType } from "@/types/role";
interface Props {
  children: React.ReactNode;
  requiredRoles?: RoleType[];
}

const ProtectedRoute = ({ requiredRoles = [], children }: Props) => {

  const { isAuthenticated, isInitialized, hasRole } = useAuth();
  const location = useLocation();

  if (!isInitialized) {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  const hasRequiredRole =
    requiredRoles.length === 0 ||
    requiredRoles.some((role) => hasRole(role));

  if (!hasRequiredRole) {
    return <Navigate to="/err" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;