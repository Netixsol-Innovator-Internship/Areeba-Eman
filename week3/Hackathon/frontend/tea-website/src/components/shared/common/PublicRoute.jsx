import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ROLES } from "../../../utils/roles";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth) || {};

  if (isAuthenticated) {
    // role-based redirect
    if (user?.role === ROLES.ADMIN || user?.role === ROLES.SUPER_ADMIN) {
      return <Navigate to="/dashboard" />;
    }
    return <Navigate to="/"  />;
  }

  return children;
};

export default PublicRoute;
