import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosIntances";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  // GET PROJECTS
  const fetchProjects = async () => {
    try {
      const res = await axiosInstance.get("task-management/projects");
      setProjects(res.data.projects);
    } catch (error) {
      toast.error("Failed to load projects");
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // ADD PROJECT
  const handleAddProject = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.warning("Project name is required");
      return;
    }

    try {
      setLoading(true);

      await axiosInstance.post("task-management/projects", {
        name,
        description,
      });

      toast.success("Project created successfully 🎉");

      setName("");
      setDescription("");

      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  // DELETE PROJECT
  const deleteProject = async (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this project?",
    );
    if (!confirm) return;

    try {
      await axiosInstance.delete(`task-management/projects/${id}`);

      toast.success("Project deleted");

      fetchProjects();
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-8">
      {/* CREATE PROJECT CARD */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-8">
        <h1 className="text-xl font-bold mb-4 text-center">
          Create New Project
        </h1>

        <form onSubmit={handleAddProject} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Project Name</label>
            <input
              type="text"
              placeholder="Enter project name"
              className="w-full border rounded-md p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              placeholder="Enter project description"
              className="w-full border rounded-md p-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-md text-white ${
              loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Creating..." : "Add Project"}
          </button>
        </form>
      </div>

      {/* PROJECT LIST */}
      <div>
        <h2 className="text-xl font-semibold mb-4">All Projects</h2>

        {projects.length === 0 ? (
          <div className="text-center text-gray-500 bg-white p-6 rounded-lg shadow">
            No projects created yet
          </div>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-white shadow-md p-5 rounded-xl"
              >
                {/* Project Info */}
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold">{project?.name}</h3>

                    <p className="text-gray-500 text-sm">
                      {project?.description}
                    </p>

                    {/* CATEGORY LIST */}
                    <div className="mt-3">
                      <p className="text-sm font-medium text-gray-600 mb-1">
                        Categories
                      </p>

                      {project.categories?.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {project.categories.map((cat) => (
                            <span
                              key={cat._id}
                              className="bg-gray-100 px-2 py-1 rounded text-xs"
                            >
                              {cat.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-400">No categories</p>
                      )}
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex flex-col gap-2">
                    <Link to={`/task-management/category/${project._id}`}>
                      <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                        Add Category
                      </button>
                    </Link>

                    <button
                      onClick={() => deleteProject(project._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Projects;
