import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isLogin, loading } = useAuth();

  if (loading) return <div>Checking authentication...</div>;

  return isLogin ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
