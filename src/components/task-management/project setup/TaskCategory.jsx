import { useState, useEffect } from "react";
import { useModal } from "../../../context/ModelContext";
import { Link, useParams } from "react-router-dom";
import axiosInstance from "../../../utils/axiosIntances";
import Loading from "../../../utils/Loding";
import { toast } from "react-toastify";

function TaskCategory() {
  const [project, setProject] = useState({});
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const { showModal } = useModal();
  const projectId = useParams().id;

  // FETCH PROJECT
  const getProjects = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(
        `/task-management/projects/${projectId}`,
      );

      setProject(res.data.project);
    } catch (error) {
      toast.error("Failed to load project");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProjects();
  }, []);

  // FETCH CATEGORIES
  const getCategories = async () => {
    try {
      setLoading(true);

      const res = await axiosInstance.get(
        `/task-management/categories/project/${project._id}`,
      );

      if (res.data.success) {
        setCategories(res.data.categories);
      }
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (project?._id) getCategories();
  }, [project]);

  // ADD CATEGORY
  const addCategory = async () => {
    if (!newCategory.trim()) {
      toast.warning("Category name is required");
      return;
    }

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
        toast.success("Category created");

        setNewCategory("");
        setDescription("");

        getCategories();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create category");
    } finally {
      setLoading(false);
    }
  };

  // DELETE CATEGORY
  const deleteCategory = async (id) => {
    try {
      setLoading(true);

      await axiosInstance.delete(`/tasks/categories/${id}`);

      toast.success("Category deleted");

      getCategories();
    } catch (error) {
      toast.error("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    showModal({
      title: "Delete Category",
      message: "Are you sure you want to delete this category?",
      onConfirm: () => deleteCategory(id),
    });
  };

  // START EDIT
  const startEdit = (cat) => {
    setEditMode(true);
    setEditingCategory(cat._id);
    setNewCategory(cat.name);
    setDescription(cat.description || "");
  };

  // CANCEL EDIT
  const cancelEdit = () => {
    setEditMode(false);
    setEditingCategory(null);
    setNewCategory("");
    setDescription("");
  };

  // UPDATE CATEGORY
  const updateCategory = async () => {
    if (!newCategory.trim()) {
      toast.warning("Category name is required");
      return;
    }

    try {
      setLoading(true);

      const res = await axiosInstance.put(
        `/tasks/categories/${editingCategory}`,
        {
          name: newCategory,
          description,
        },
      );

      if (res.status === 200) {
        toast.success("Category updated");

        cancelEdit();

        getCategories();
      }
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* PROJECT HEADER */}
      <div className=" shadow-md rounded-lg p-4 mb-6 flex items-center gap-2">
        <span className="font-semibold text-gray-600">Project:</span>
        <span className="font-bold text-lg">{project?.name}</span>
      </div>

      {/* CATEGORY FORM */}
      <div className=" shadow-md rounded-lg p-6 mb-8">
        <h1 className="text-xl font-bold mb-4">
          {editMode ? "Update Category" : "Add New Category"}
        </h1>

        <div className="grid md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="border rounded-lg px-4 py-2"
          />

          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border rounded-lg px-4 py-2"
          />
        </div>

        <div className="flex gap-3 mt-4">
          {editMode ? (
            <>
              <button
                onClick={updateCategory}
                className="bg-green-500  px-5 py-2 rounded hover:bg-green-600"
              >
                Update
              </button>

              <button
                onClick={cancelEdit}
                className="bg-gray-400 px-5 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={addCategory}
              className="bg-blue-500  px-5 py-2 rounded hover:bg-blue-600"
            >
              Add Category
            </button>
          )}
        </div>
      </div>

      {/* CATEGORY LIST */}

      <h2 className="text-xl font-semibold mb-4">Categories</h2>

      {categories.length === 0 ? (
        <div className="bg-white p-6 text-center rounded-lg shadow">
          No categories created yet
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="bg-white shadow-md rounded-xl p-5 hover:shadow-lg transition"
            >
              <h2 className="text-lg font-semibold">{cat.name}</h2>

              <p className="text-gray-500 text-sm mt-1">
                {cat.description || "No description"}
              </p>

              <div className="flex gap-2 mt-4 flex-wrap">
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
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskCategory;
