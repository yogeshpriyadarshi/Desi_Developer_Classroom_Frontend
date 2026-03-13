import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosIntances";

function AddEditTask({ editingTask, onTaskSaved }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [status, setStatus] = useState("pending");
  const [dueDate, setDueDate] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [recurrenceType, setRecurrenceType] = useState("");
  const [isDailyTask, setIsDailyTask] = useState(false);

  const editMode = editingTask !== null;

  // Load categories
  const getCategories = async () => {
    try {
      const res = await axiosInstance.get("/tasks/categories");
      setCategories(res.data.categories);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  // If editing task -> fill fields
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || "");
      setPriority(editingTask.priority);
      setStatus(editingTask.status);
      setDueDate(editingTask.dueDate?.slice(0, 10) || "");
      setCategory(editingTask.category?._id || "");
      setRecurrenceType(editingTask.recurrenceType || "");
      setIsDailyTask(editingTask.isDailyTask || false);
    }
  }, [editingTask]);

  // ADD TASK
  const addTask = async () => {
    try {
      await axiosInstance.post("/tasks", {
        title,
        description,
        priority,
        status,
        dueDate,
        category,
        recurrenceType,
        isDailyTask,
      });

      resetForm();
      onTaskSaved();
    } catch (error) {
      console.log(error);
    }
  };

  // UPDATE TASK
  const updateTask = async () => {
    try {
      await axiosInstance.put(`/tasks/${editingTask._id}`, {
        title,
        description,
        priority,
        status,
        dueDate,
        category,
        recurrenceType,
        isDailyTask,
      });

      resetForm();
      onTaskSaved();
    } catch (error) {
      console.log(error);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setStatus("pending");
    setDueDate("");
    setCategory("");
    setRecurrenceType("");
    setIsDailyTask(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">
        {editMode ? "Edit Task" : "Add Task"}
      </h2>

      <div className="space-y-4">
        {/* Title */}
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />

        {/* Description */}
        <textarea
          placeholder="Task description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />

        {/* Priority */}
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        {/* Status */}
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        >
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>

        {/* Category */}
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        >
          <option value="">Select Category</option>

          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Due Date */}
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        />

        {/* Recurrence */}
        <select
          value={recurrenceType}
          onChange={(e) => setRecurrenceType(e.target.value)}
          className="w-full border rounded-lg px-3 py-2"
        >
          <option value="">No Recurrence</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>

        {/* Daily Task */}
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isDailyTask}
            onChange={() => setIsDailyTask(!isDailyTask)}
          />
          Daily Routine Task
        </label>

        {/* Button */}

        {editMode ? (
          <button
            onClick={updateTask}
            className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
          >
            Update Task
          </button>
        ) : (
          <button
            onClick={addTask}
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          >
            Add Task
          </button>
        )}
      </div>
    </div>
  );
}

export default AddEditTask;
