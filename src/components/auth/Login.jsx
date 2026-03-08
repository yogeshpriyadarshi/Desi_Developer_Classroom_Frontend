import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosIntances";
import { useAuth } from "../../context/AuthContext";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { setIsLogin } = useAuth();
  const handleLogin = async () => {
    try {
      setMessage("Logging in...");
      console.log(email, password);
      const response = await axiosInstance.post(`/auth/login`, {
        email,
        password,
      });
      setMessage(response.data.message);
      setIsLogin(true);
      localStorage.setItem("access_token", response.data.access_token);

      navigate("/");
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };
  return (
    <>
      <div className="flex  mt-10 items-center justify-around  min-h-screen">
        <div className="flex flex-col">
          <input
            type="email"
            placeholder="Email"
            value={email}
            className="border border-gray-300 rounded-md p-2 m-2"
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="relative w-full max-w-sm">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              className="border border-gray-300 p-2 w-full rounded-md pr-10"
            />

            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button
            onClick={handleLogin}
            className="border border-gray-300 rounded-md p-2 m-2 bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
          >
            Login
          </button>
          <p>{message}</p>
          <div className="flex flex-col">
            <p>Don't have an account?</p>
            <Link
              to="/signup"
              className="text-blue-500 hover:underline cursor-pointer"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
