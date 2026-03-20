// ======================= SideBar.jsx =======================
import { Link, useLocation } from "react-router-dom";
import { FaDumbbell, FaList } from "react-icons/fa";

function SideBar({ closeSidebar }) {
  const location = useLocation();

  const sidebar = [
    { name: "practice", icon: <FaDumbbell /> },
    { name: "todolist", icon: <FaList /> },
    { name: "task-management", icon: <FaList /> },
  ];

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Close button (mobile) */}
      <button className="md:hidden mb-4 text-right" onClick={closeSidebar}>
        ✕
      </button>

      {sidebar.map((item) => {
        const isActive = location.pathname === `/${item.name}`;

        return (
          <Link
            key={item.name}
            to={`/${item.name}`}
            onClick={closeSidebar}
            className={`flex items-center gap-3 text-lg p-2 rounded-md border
            ${
              isActive
                ? "bg-blue-500 text-white border-blue-500"
                : "text-blue-500 border-blue-500 hover:bg-blue-50"
            }`}
          >
            {item.icon}
            {item.name}
          </Link>
        );
      })}
    </div>
  );
}

export default SideBar;
