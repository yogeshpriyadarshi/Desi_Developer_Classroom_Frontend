import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosIntances";

function Login() {
  const [email, setEmail] = useState("yogesh@gmail.com");
  const [password, setPassword] = useState("12345");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const handleLogin = async () => {
    try {
      setMessage("Logging in...");
      console.log(email, password);
      const response = await axiosInstance.post(`/auth/login`, {
        email,
        password,
      });
      setMessage(response.data.message);
      localStorage.setItem("access_token", response.data.access_token);
      navigate("/");
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };
  return (
    <>
      <div className="flex  mt-10 items-center justify-around  min-h-screen">
        <div>Welcome to Desi Classroom</div>
        <div className="flex flex-col">
          <input
            type="email"
            placeholder="Email"
            value={email}
            className="border border-gray-300 rounded-md p-2 m-2"
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border border-gray-300 rounded-md p-2 m-2"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleLogin}
            className="border border-gray-300 rounded-md p-2 m-2 bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
          >
            Login
          </button>
          <p>{message}</p>
        </div>
      </div>
    </>
  );
}

export default Login;
