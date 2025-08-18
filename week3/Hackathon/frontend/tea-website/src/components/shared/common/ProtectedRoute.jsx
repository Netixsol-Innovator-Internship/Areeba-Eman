import { Navigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const user = localStorage.getItem('token');
    console.log(user)
    if (!isAuthenticated) {

        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
