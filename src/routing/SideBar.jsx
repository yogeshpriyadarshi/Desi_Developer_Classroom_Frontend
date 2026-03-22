// ======================= SideBar.jsx =======================
import { Link, useLocation } from "react-router-dom";
import { FaDumbbell, FaList } from "react-icons/fa";

function SideBar({ closeSidebar }) {
  const location = useLocation();

  const sidebar = [
    { path: "desi-html", title: "HTML", icon: <FaList /> },
    { path: "desi-css", title: "CSS", icon: <FaList /> },
    { path: "desi-javascript", title: "Javascript", icon: <FaList /> },
    { path: "desi-react", title: "React", icon: <FaList /> },
    { path: "desi-node", title: "Node", icon: <FaList /> },
    { path: "quant", title: "Quantitative Aptitude", icon: <FaDumbbell /> },
    { path: "todolist", title: "To Do List", icon: <FaList /> },
    { path: "task-management", title: "Task Management", icon: <FaList /> },
  ];

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Close button (mobile) */}
      <button className="md:hidden mb-4 text-right" onClick={closeSidebar}>
        ✕
      </button>

      {sidebar.map((item) => {
        const isActive = location.pathname === `/${item.path}`;

        return (
          <Link
            key={item.path}
            to={`/${item.path}`}
            onClick={closeSidebar}
            className={`flex items-center gap-3 text-lg p-2 rounded-md border
            ${
              isActive
                ? "bg-blue-500 text-white border-blue-500"
                : "text-blue-500 border-blue-500 hover:bg-blue-50"
            }`}
          >
            {item.icon}
            {item.title}
          </Link>
        );
      })}
    </div>
  );
}

export default SideBar;
