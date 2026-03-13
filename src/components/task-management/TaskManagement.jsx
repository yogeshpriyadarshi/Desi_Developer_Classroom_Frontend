import { FaBook, FaDumbbell, FaQuestionCircle, FaList } from "react-icons/fa";
import { Link, Outlet } from "react-router-dom";

function TaskManagement() {
  const task = [
    {
      name: "Projects Set Up",
      path: "/task-management/projects",
      icon: <FaList />,
    },
    {
      name: "Daily Task Update",
      path: "/task-management/daily-task-update",
      icon: <FaList />,
    },
    {
      name: "Task Log Viewer",
      path: "/task-management/task-log-viewer",
      icon: <FaList />,
    },
  ];
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Task</h1>
      <div className="flex gap-3">
        {task.map((item) => (
          <Link
            key={item.name}
            to={`${item.path}`}
            className="flex items-center gap-3 text-blue-500 text-lg border border-blue-500 p-2 rounded-md hover:bg-blue-50"
          >
            {item.icon}
            {item.name}
          </Link>
        ))}
      </div>

      <Outlet />
    </div>
  );
}

export default TaskManagement;
