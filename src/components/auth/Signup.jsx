import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }
    try {
      const response = await axios.post(`${BASE_URL}/auth/signup`, {
        email,
        password,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong");
    }
  };
  return (
    <>
      <div className="flex justify-center mt-10 items-center min-h-screen">
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className="relative w-full max-w-sm">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Enter confirm password"
              className="border border-gray-300 p-2 w-full rounded-md pr-10"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <button
            onClick={handleSignup}
            className="border border-gray-300 rounded-md p-2 m-2 bg-blue-500 text-white"
          >
            Signup
          </button>
          <p>{message}</p>
          <div className="flex flex-col">
            <p>Already have an account?</p>
            <Link
              to="/login"
              className="text-blue-500 hover:underline cursor-pointer"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default Signup;
