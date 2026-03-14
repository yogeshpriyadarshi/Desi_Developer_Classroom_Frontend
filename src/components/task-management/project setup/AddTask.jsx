import { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosIntances";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

function AddTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState({});
  const [priority, setPriority] = useState("medium");
  const [tasks, setTasks] = useState([]);

  const [recurrenceType, setRecurrenceType] = useState("daily");
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [dayOfMonth, setDayOfMonth] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [loading, setLoading] = useState(false);

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const { id: categoryId } = useParams();

  // Fetch tasks
  const getTasks = async () => {
    try {
      const res = await axiosInstance.get(
        `/task-management/tasks/category/${categoryId}`,
      );

      if (res.data.success) {
        setTasks(res.data.tasks);
      }
    } catch (err) {
      toast.error("Failed to load tasks");
    }
  };

  // Fetch category
  const getCategory = async () => {
    try {
      const res = await axiosInstance.get(
        `/task-management/categories/${categoryId}`,
      );

      setCategory(res.data.category);
    } catch (err) {
      toast.error("Failed to load category");
    }
  };

  useEffect(() => {
    getTasks();
    getCategory();
  }, []);

  // Weekly toggle
  const toggleDay = (index) => {
    if (daysOfWeek.includes(index)) {
      setDaysOfWeek(daysOfWeek.filter((d) => d !== index));
    } else {
      setDaysOfWeek([...daysOfWeek, index]);
    }
  };

  const validateForm = () => {
    if (!title.trim()) {
      toast.warning("Task title is required");
      return false;
    }

    if (!startDate) {
      toast.warning("Start date is required");
      return false;
    }

    if (recurrenceType === "weekly" && daysOfWeek.length === 0) {
      toast.warning("Select at least one weekday");
      return false;
    }

    if (recurrenceType === "monthly" && !dayOfMonth) {
      toast.warning("Enter day of month");
      return false;
    }

    return true;
  };

  const addTask = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      await axiosInstance.post(
        `/task-management/tasks/category/${categoryId}`,
        {
          title,
          description,
          recurrenceType,
          daysOfWeek,
          dayOfMonth,
          startDate,
          endDate,
          priority,
        },
      );

      toast.success("Task added successfully 🎉");

      resetForm();
      getTasks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setRecurrenceType("daily");
    setDaysOfWeek([]);
    setDayOfMonth("");
    setStartDate("");
    setEndDate("");
    setPriority("medium");
  };

  const priorityColor = {
    low: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-red-100 text-red-700",
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white shadow-md rounded-xl p-4 mb-6">
        <p className="text-sm text-gray-500">
          Project:{" "}
          <span className="font-semibold">{category?.project?.name}</span>
        </p>
        <p className="text-sm text-gray-500">
          Category: <span className="font-semibold">{category?.name}</span>
        </p>
      </div>

      {/* Form */}
      <div className="bg-white shadow-lg rounded-xl p-6 space-y-5">
        <h2 className="text-xl font-bold">Create Task</h2>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-1">Task Title</label>
          <input
            type="text"
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            rows="3"
            placeholder="Task description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-lg px-3 py-2"
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium mb-1">Priority</label>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full border rounded-lg p-2"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Recurrence */}
        <div className="border-t pt-4 space-y-4">
          <h3 className="font-semibold text-gray-600">Recurrence Settings</h3>

          <select
            value={recurrenceType}
            onChange={(e) => setRecurrenceType(e.target.value)}
            className="w-full border rounded-lg p-2"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>

          {/* Weekly */}
          {recurrenceType === "weekly" && (
            <div className="flex flex-wrap gap-2">
              {weekDays.map((day, index) => (
                <button
                  key={index}
                  onClick={() => toggleDay(index)}
                  type="button"
                  className={`px-3 py-1 rounded border ${
                    daysOfWeek.includes(index)
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100"
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          )}

          {/* Monthly */}
          {recurrenceType === "monthly" && (
            <input
              type="number"
              placeholder="Day of month (1-31)"
              value={dayOfMonth}
              onChange={(e) => setDayOfMonth(e.target.value)}
              className="w-full border rounded-lg px-3 py-2"
            />
          )}

          {/* Dates */}
          <div className="grid md:grid-cols-2 gap-3">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="border rounded-lg px-3 py-2"
            />

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="border rounded-lg px-3 py-2"
            />
          </div>
        </div>

        <button
          onClick={addTask}
          disabled={loading}
          className={`w-full py-2 rounded-lg text-white ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Creating Task..." : "Add Task"}
        </button>
      </div>

      {/* Task List */}

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-3">Category Tasks</h3>

        {tasks.length === 0 ? (
          <div className="bg-gray-50 p-4 rounded text-center text-gray-500">
            No tasks created yet
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task._id}
                className="bg-white border rounded-lg p-3 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{task.title}</p>

                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      priorityColor[task.priority]
                    }`}
                  >
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AddTask;
