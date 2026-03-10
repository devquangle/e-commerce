import { useAuth } from "@/context/useAuth";
import { Navigate, useLocation } from "react-router-dom";

interface Props {
  children: React.ReactNode;
  requiredRoles?: string[];
}

const ProtectedRoute = ({ requiredRoles = [], children }: Props) => {
  const { isAuthenticated, isInitialized, hasRole } = useAuth();
  const location = useLocation();

  // auth chưa load
  if (!isInitialized) {
    return null;
  }

  // chưa login
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location }}
      />
    );
  }

  // check role
  const hasRequiredRole =
    requiredRoles.length === 0 ||
    requiredRoles.some((role) => hasRole(role));

  if (!hasRequiredRole) {
    return <Navigate to="/err" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;