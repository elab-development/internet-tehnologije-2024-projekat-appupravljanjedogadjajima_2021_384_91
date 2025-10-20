import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, requiredRole }) {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user")); 

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRole === "admin" && user?.role !== "admin") {
        return <Navigate to="/" replace />;  
    }

    return children;
}
