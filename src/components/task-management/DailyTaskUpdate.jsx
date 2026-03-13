import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosIntances";
import { Link } from "react-router-dom";

function DailyTaskUpdate() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [selectedProject, setSelectedProject] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const today = new Date();

  // fetch projects
  const getProjects = async () => {
    const res = await axiosInstance.get("/task-management/projects");
    setProjects(res.data.projects);
  };

  // fetch categories
  const getCategories = async (projectId) => {
    const res = await axiosInstance.get(
      `/task-management/categories/project/${projectId}`,
    );
    setCategories(res.data.categories);
  };

  // fetch tasks
  const getTasks = async (categoryId) => {
    const res = await axiosInstance.get(
      `/task-management/tasks/category/${categoryId}`,
    );
    setTasks(res.data.tasks);
  };

  useEffect(() => {
    getProjects();
  }, []);

  const handleProject = (id) => {
    setSelectedProject(id);
    getCategories(id);
  };

  const handleCategory = (id) => {
    setSelectedCategory(id);
    getTasks(id);
  };

  // CHECK TASK BELONGS TO TODAY
  const isTaskForToday = (task) => {
    console.log("each task ", task);

    const day = today.getDay(); // 0-6
    const date = today.getDate(); // 1-31

    if (task.recurrenceType === "daily") {
      return true;
    }

    if (task.recurrenceType === "weekly") {
      return task.daysOfWeek?.includes(day);
    }

    if (task.recurrenceType === "monthly") {
      return task.dayOfMonth === date;
    }

    return false;
  };

  const todaysTasks = tasks.filter(isTaskForToday);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Daily Tasks</h1>

      {/* Project Selection */}

      <select
        onChange={(e) => handleProject(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      >
        <option>Select Project</option>

        {projects.map((p) => (
          <option key={p._id} value={p._id}>
            {p.name}
          </option>
        ))}
      </select>

      {/* Category Selection */}

      <select
        onChange={(e) => handleCategory(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      >
        <option>Select Category</option>

        {categories.map((c) => (
          <option key={c._id} value={c._id}>
            {c.name}
          </option>
        ))}
      </select>

      {/* Tasks */}

      <div className="space-y-3">
        {todaysTasks.map((task) => (
          <>
            <div key={task._id} className="bg-white p-4 shadow rounded-lg">
              <h2 className="font-semibold">{task.title}</h2>

              <p className="text-gray-500 text-sm">{task.description}</p>
            </div>
            <Link to={`/task-management/daily-task-performance/${task._id}`}>
              {" "}
              Add Performance{" "}
            </Link>
          </>
        ))}

        {todaysTasks.length === 0 && (
          <p className="text-gray-500">No tasks for today</p>
        )}
      </div>
    </div>
  );
}

export default DailyTaskUpdate;
