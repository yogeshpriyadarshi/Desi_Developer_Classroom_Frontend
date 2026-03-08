import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../utils/axiosIntances";

// three steps
// 1. create context
// 2. create provider
// 3. create consumer

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    const token = localStorage.getItem("access_token");

    // check token is available in local store.
    if (!token) {
      // if token is not available.
      setIsLogin(false); //  user is not login.
      setLoading(false); //  loading is false because stop checking authentication.
      return;
    }

    // if token is available then check its validity
    try {
      const res = await axiosInstance.get(`/auth/verify-token`);
      if (res.data.success) {
        setIsLogin(true);
      } else {
        localStorage.removeItem("access_token");
        setIsLogin(false);
      }
    } catch (err) {
      localStorage.removeItem("access_token");
      setIsLogin(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ isLogin, setIsLogin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
