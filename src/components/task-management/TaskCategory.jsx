import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosIntances";
import Loading from "../../utils/Loding";
import { useModal } from "../../context/ModelContext";
import { Link, useParams } from "react-router-dom";

function TaskCategory() {
  const [project, setProject] = useState({});
  const [selectedProject, setSelectedProject] = useState({});
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [error, setError] = useState("");

  const { showModal } = useModal();

  const projectId = useParams().id;

  // get all projects
  const getProjects = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        `/task-management/projects/${projectId}`,
      );
      setProject(res.data.project);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProjects();
  }, []);

  const getCategories = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        `/task-management/categories/project/${project._id}`,
      );
      if (res.data.success) setCategories(res.data.categories);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (project) getCategories();
  }, [project]);

  // ADD CATEGORY
  const addCategory = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.post(
        `/task-management/categories/project/${project._id}`,
        {
          name: newCategory,
          description,
        },
      );

      if (res.status === 201) {
        getCategories();
        setNewCategory("");
        setError("");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // DELETE CATEGORY
  const deleteCategory = async (id) => {
    try {
      setLoading(true);
      await axiosInstance.delete(`/tasks/categories/${id}`);
      getCategories();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // HANDLE DELETE WITH MODAL
  const handleDelete = (id) => {
    showModal({
      title: "Delete Category",
      message: "Are you sure you want to delete this category?",
      onConfirm: () => deleteCategory(id),
    });
  };

  // EDIT BUTTON CLICK
  const startEdit = (cat) => {
    setEditMode(true);
    setEditingCategory(cat._id);
    setNewCategory(cat.name);
  };

  // UPDATE CATEGORY
  const updateCategory = async () => {
    try {
      const res = await axiosInstance.put(
        `/tasks/categories/${editingCategory}`,
        {
          name: newCategory,
        },
      );

      if (res.status === 200) {
        setEditMode(false);
        setEditingCategory(null);
        setNewCategory("");
        getCategories();
      }
    } catch (error) {
      console.log(error);
    }
  };
  if (loading) {
    return <Loading />;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* selected project */}
      <div className="flex flex-row">
        <h2 className="text-lg font-semibold m-2">Selected Project:</h2>
        <p className="font-bold text-xl m-2">{project?.name}</p>
      </div>
      <h1 className="text-2xl font-bold mb-6">Add New Category</h1>

      {/* Add / Update Category */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Enter category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        {editMode ? (
          <button
            onClick={updateCategory}
            className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600"
          >
            Update
          </button>
        ) : (
          <button
            onClick={addCategory}
            className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600"
          >
            Add
          </button>
        )}
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Category List */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {categories.length > 0 ? (
          categories.map((cat) => (
            <div
              key={cat._id}
              className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold">{cat.name}</h2>

              <p className="text-gray-500 text-sm mt-1">
                Manage tasks under this category
              </p>

              {/* Buttons */}

              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => startEdit(cat)}
                  className="bg-yellow-400 px-3 py-1 rounded text-sm hover:bg-yellow-500"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(cat._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                >
                  Delete
                </button>
                <Link
                  to={`/task-management/task/${cat._id}`}
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                >
                  Add Task
                </Link>
              </div>
            </div>
          ))
        ) : (
          <p>No categories found</p>
        )}
      </div>
    </div>
  );
}

export default TaskCategory;
