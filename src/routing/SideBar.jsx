import { Link, useLocation } from "react-router-dom";
import { FaDumbbell, FaList } from "react-icons/fa";
import { FaItalic } from "react-icons/fa6";

function SideBar({ closeSidebar }) {
  const location = useLocation();

  const sidebar = [
    { path: "dsa", title: "DSA", icon: <FaList /> },
    { path: "online-coding", title: "Online Coding", icon: <FaList /> },
    { path: "recorder", title: "Screen Recorder", icon: <FaDumbbell /> },
    { path: "drawing", title: "Drawing", icon: <FaList /> },
    { path: "video-recorder", title: "Video Recorder", icon: <FaList /> },
    { path: "screenandvideo-recorder", title: "Screen + Video Recorder", icon: <FaList /> },
    { path: "video-editor", title: "Video Editor", icon: <FaList /> }
  ];

  return (
    <div
      className="group flex flex-col gap-3 h-full 
             w-12 hover:w-44 transition-all duration-300 overflow-hidden"
    >

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
  ${isActive
                ? "bg-blue-500 text-white border-blue-500"
                : "text-blue-500 border-blue-500 hover:bg-blue-50"
              }`}
          >
            {/* Center icon when collapsed */}
            <span className="text-xl mx-auto group-hover:mx-0">
              {item.icon}
            </span>

            {/* Text */}
            <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap">
              {item.title}
            </span>
          </Link>
        );
      })}
      <button
        onClick={() => document.documentElement.classList.toggle("dark")}
      >
        Toggle Dark Mode
      </button>
    </div>
  );
}

export default SideBar;