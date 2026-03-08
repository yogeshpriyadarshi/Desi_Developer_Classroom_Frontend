import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosIntances";

function Header() {
  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      localStorage.removeItem("access_token");
      window.location.href = "/login";
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <Link
        to="/"
        className="text-blue-500 text-2xl border border-blue-500 p-2 rounded-md"
      >
        Home
      </Link>
      <button
        onClick={logout}
        className="border border-gray-300 rounded-md p-2"
      >
        Logout
      </button>
    </>
  );
}

export default Header;
