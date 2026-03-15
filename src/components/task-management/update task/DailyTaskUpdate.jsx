import { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosIntances";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function DailyTaskUpdate() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [selectedProject, setSelectedProject] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const today = new Date();

  // fetch All tasks
  const getAllTasks = async () => {
    try {
      const res = await axiosInstance.get("/task-management/tasks");
      setTasks(res.data.tasks);
    } catch (err) {
      toast.error("Failed to load tasks");
    }
  };

  useEffect(() => {
    getAllTasks();
    getProjects();
  }, []);

  // fetch projects
  const getProjects = async () => {
    try {
      const res = await axiosInstance.get("/task-management/projects");
      setProjects(res.data.projects);
    } catch (err) {
      toast.error("Failed to load projects");
    }
  };

  // fetch categories
  const getCategories = async (projectId) => {
    try {
      const res = await axiosInstance.get(
        `/task-management/categories/project/${projectId}`,
      );
      setCategories(res.data.categories);
    } catch (err) {
      toast.error("Failed to load categories");
    }
  };

  // fetch tasks
  const getTasks = async (categoryId) => {
    try {
      const res = await axiosInstance.get(
        `/task-management/tasks/category/${categoryId}`,
      );
      setTasks(res.data.tasks);
    } catch (err) {
      toast.error("Failed to load tasks");
    }
  };

  const handleProject = (id) => {
    setSelectedProject(id);
    setSelectedCategory("");
    setTasks([]);
    getCategories(id);
  };

  const handleCategory = (id) => {
    setSelectedCategory(id);
    getTasks(id);
  };

  // check if task belongs today
  const isTaskForToday = (task) => {
    const day = today.getDay();
    const date = today.getDate();

    if (task.recurrenceType === "daily") return true;
    if (task.recurrenceType === "weekly") return task.daysOfWeek?.includes(day);
    if (task.recurrenceType === "monthly") return task.dayOfMonth === date;

    return false;
  };

  const todaysTasks = tasks.filter(isTaskForToday);

  const priorityColor = {
    low: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-red-100 text-red-700",
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Today's Tasks</h1>
        <p className="text-gray-500">{today.toDateString()}</p>
      </div>

      {/* Filters */}

      <div className="grid md:grid-cols-2 gap-4 mb-6">
        {/* Project */}
        <select
          value={selectedProject}
          onChange={(e) => handleProject(e.target.value)}
          className="border rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Project</option>

          {projects.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>

        {/* Category */}
        <select
          value={selectedCategory}
          onChange={(e) => handleCategory(e.target.value)}
          className="border rounded-lg p-3 shadow-sm focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select Category</option>

          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Task List */}

      {todaysTasks.length === 0 ? (
        <div className="bg-gray-50 text-center p-10 rounded-lg">
          <p className="text-gray-500 text-lg">No tasks scheduled for today</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {todaysTasks.map((task) => (
            <div
              key={task._id}
              className="bg-white shadow-md rounded-xl p-5 flex justify-between items-center hover:shadow-lg transition"
            >
              {/* Task Info */}
              <div>
                <h2 className="text-lg font-semibold">{task.title}</h2>

                <p className="text-gray-500 text-sm mt-1">{task.description}</p>

                <div className="flex gap-2 mt-2">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      priorityColor[task.priority]
                    }`}
                  >
                    {task.priority}
                  </span>

                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {task.recurrenceType}
                  </span>
                </div>
              </div>

              {/* Button */}
              <Link
                to={`/task-management/daily-task-performance/${task._id}`}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Add Performance
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DailyTaskUpdate;
