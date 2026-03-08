import axios from "axios";
import { useState } from "react";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
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
          <input
            type="password"
            placeholder="Password"
            value={password}
            className="border border-gray-300 rounded-md p-2 m-2"
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="border border-gray-300 rounded-md p-2 m-2"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            onClick={handleSignup}
            className="border border-gray-300 rounded-md p-2 m-2 bg-blue-500 text-white"
          >
            Signup
          </button>
          <p>{message}</p>
        </div>
      </div>
    </>
  );
}

export default Signup;
