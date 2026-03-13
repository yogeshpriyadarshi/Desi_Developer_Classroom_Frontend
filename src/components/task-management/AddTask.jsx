import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosIntances";
import { useParams } from "react-router-dom";

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
      console.log("task fetch error", err);
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
      console.log(err);
    }
  };

  useEffect(() => {
    getTasks();
    getCategory();
  }, []);

  // Weekly day toggle
  const toggleDay = (index) => {
    if (daysOfWeek.includes(index)) {
      setDaysOfWeek(daysOfWeek.filter((d) => d !== index));
    } else {
      setDaysOfWeek([...daysOfWeek, index]);
    }
  };

  const addTask = async () => {
    try {
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

      resetForm();
      getTasks();
    } catch (err) {
      console.log(err);
    }
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setRecurrenceType("none");
    setDaysOfWeek([]);
    setDayOfMonth("");
    setStartDate("");
    setEndDate("");
    setPriority("medium");
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-xl mx-auto">
      {/* Project + Category */}

      <div className="flex gap-4 mb-4">
        <h1 className="font-semibold">Project: {category?.project?.name}</h1>

        <h1 className="font-semibold">Category: {category?.name}</h1>
      </div>

      {/* form for adding task */}

      <div className="bg-white shadow-md rounded-xl p-6 space-y-6">
        <h2 className="text-xl font-semibold text-gray-700">Add New Task</h2>

        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Task Title
          </label>
          <input
            type="text"
            placeholder="Enter task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Description
          </label>
          <textarea
            placeholder="Write task description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Priority
          </label>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Recurrence Section */}
        <div className="border-t pt-4 space-y-4">
          <h3 className="font-medium text-gray-700">Recurrence Settings</h3>

          {/* Recurrence Type */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Recurrence Type
            </label>

            <select
              value={recurrenceType}
              onChange={(e) => setRecurrenceType(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          {/* Weekly */}
          {recurrenceType === "weekly" && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">
                Select Days
              </label>

              <div className="flex gap-2 flex-wrap">
                {weekDays.map((day, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => toggleDay(index)}
                    className={`px-3 py-1 rounded-lg border transition
                ${
                  daysOfWeek.includes(index)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Monthly */}
          {recurrenceType === "monthly" && (
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Day of Month
              </label>

              <input
                type="number"
                placeholder="Enter day (1-31)"
                value={dayOfMonth}
                onChange={(e) => setDayOfMonth(e.target.value)}
                className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
          )}

          {/* Start Date */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Start Date
            </label>

            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          {/* End Date */}
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              End Date
            </label>

            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>
        </div>

        {/* Button */}
        <button
          onClick={addTask}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Add Task
        </button>
      </div>

      {/* Task List */}

      <div className="mt-6">
        <h3 className="font-semibold mb-2">Tasks</h3>

        {tasks.length === 0 && <p>No tasks yet</p>}

        {tasks.map((task) => (
          <div key={task._id} className="border p-2 rounded mb-2">
            {task.title}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AddTask;
