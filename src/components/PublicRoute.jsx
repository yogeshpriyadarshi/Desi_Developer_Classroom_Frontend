import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ children }) => {
  const { isLogin, loading } = useAuth();

  if (loading) return <div>Checking authentication...</div>;

  return isLogin ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoute;
