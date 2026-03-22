import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "../utils/Loding";

const ProtectedRoute = ({ children }) => {
  const { isLogin, loading } = useAuth();

  if (loading)
    return (
      <>
        <Loading />
      </>
    );
  return isLogin ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
