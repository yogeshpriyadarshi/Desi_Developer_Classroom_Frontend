import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "../utils/Loding";

const PublicRoute = ({ children }) => {
  const { isLogin, loading } = useAuth();

  if (loading)
    return (
      <>
        <Loading />
      </>
    );

  return isLogin ? <Navigate to="/" /> : <Outlet />;
};

export default PublicRoute;
