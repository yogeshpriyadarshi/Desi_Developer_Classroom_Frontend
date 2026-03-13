import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosIntances";
import { Link } from "react-router-dom";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingProject, setEditingProject] = useState(null);

  // GET PROJECTS
  const fetchProjects = async () => {
    try {
      const res = await axiosInstance.get("task-management/projects");
      setProjects(res.data.projects);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // DELETE PROJECT
  const deleteProject = async (id) => {
    try {
      await axiosInstance.delete(`task-management/projects/${id}`);
      fetchProjects();
    } catch (error) {
      console.log(error);
    }
  };

  // AFTER ADD / UPDATE
  const handleProjectSaved = () => {
    setEditingProject(null); // switch back to add mode
    fetchProjects();
  };

  // add project
  const handleAddProject = async (e) => {
    e.preventDefault();

    try {
      await axiosInstance.post("task-management/projects", {
        name,
        description,
      });

      setName("");
      setDescription("");
      handleProjectSaved();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex justify-center border border-gray-300 p-4 rounded-md">
        <h1 className="text-xl text-center font-semibold m-4">
          Create New Project
        </h1>

        <form onSubmit={handleAddProject} className="space-y-4 mx-auto">
          <input
            type="text"
            placeholder="name"
            className="border border-gray-300 rounded-md p-2 m-4"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            className="border border-gray-300 rounded-md p-2 m-4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Add Project
          </button>
        </form>
      </div>

      {/* Project List */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">All Projects</h2>

        {projects.length === 0 ? (
          <p>No projects found</p>
        ) : (
          <div className="space-y-4">
            {projects.map((project) => (
              <div
                key={project._id}
                className="bg-white shadow-md p-4 rounded-lg flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold text-lg">{project?.name}</h3>

                  <p className="text-gray-500 text-sm">
                    {project?.description}
                  </p>
                </div>

                {/* Buttons */}

                <div className="flex gap-3">
                  <Link to={`/task-management/category/${project._id}`}>
                    <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
                      Add Category
                    </button>
                  </Link>
                  <button
                    onClick={() => setEditingProject(project)}
                    className="bg-yellow-400 px-3 py-1 rounded text-sm hover:bg-yellow-500"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => deleteProject(project._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Projects;
