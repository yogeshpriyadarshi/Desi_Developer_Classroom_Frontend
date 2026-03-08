import { Link } from "react-router-dom";
import axiosInstance from "../utils/axiosIntances";
import { FaHome, FaSignOutAlt } from "react-icons/fa";

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
    <div className="flex items-center gap-4 p-4 bg-gray-100">
      <Link
        to="/"
        className="flex items-center gap-2 text-blue-500 text-xl border border-blue-500 p-2 rounded-md hover:bg-blue-50"
      >
        <FaHome />
        Home
      </Link>

      <button
        onClick={logout}
        className="flex items-center gap-2 border border-gray-300 rounded-md p-2 hover:bg-gray-200"
      >
        <FaSignOutAlt />
        Logout
      </button>
    </div>
  );
}

export default Header;
