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

  useEffect(() => {
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

      {tasks.length === 0 ? (
        <div className="bg-gray-50 text-center p-10 rounded-lg">
          <p className="text-gray-500 text-lg">No tasks scheduled for today</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white shadow-md rounded-xl p-5 flex justify-between items-center hover:shadow-lg transition"
            >
              {/* Task Info */}
              <div>
                <h2 className="text-lg font-semibold">{task.title}</h2>

                <p className="text-gray-500 text-sm mt-1">{task.description}</p>
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
