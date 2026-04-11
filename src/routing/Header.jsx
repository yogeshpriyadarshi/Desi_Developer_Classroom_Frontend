import { NavLink, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosIntances";
import { FaHome, FaSignOutAlt, FaUser } from "react-icons/fa";

function Header() {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");

      localStorage.removeItem("access_token");

      // Better navigation instead of reload
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  const linkStyle =
    "flex items-center gap-2 px-4 py-2 rounded-lg transition-all";

  return (
    <header className="bg-whiteshadow-md px-6 py-3 flex justify-between items-center">
      
      {/* Logo / Title */}
      <h1 className="text-xl font-bold text-blue-600 mx-5">
        Desi Developer Classroom
      </h1>

      {/* Navigation */}
      <nav className="flex items-center gap-4">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${linkStyle} ${
              isActive
                ? "bg-blue-500 text-white"
                : "text-blue-500 hover:bg-blue-50"
            }`
          }
        >
          <FaHome />
          Home
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) =>
            `${linkStyle} ${
              isActive
                ? "bg-blue-500 text-white"
                : "text-blue-500 hover:bg-blue-50"
            }`
          }
        >
          <FaUser />
          Profile
        </NavLink>
        <button
  onClick={() => document.documentElement.classList.toggle("dark")}
>
  Toggle Dark Mode
</button>


        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 hover:bg-red-50 text-gray-700 hover:text-red-500 transition-all"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </nav>
    </header>
  );
}

export default Header;