import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosIntances";
import { useParams } from "react-router-dom";

function AddTask() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState({});
  const [tasks, setTasks] = useState([]);

  const [recurrenceType, setRecurrenceType] = useState("none");
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
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md max-w-xl mx-auto">
      {/* Project + Category */}

      <div className="flex gap-4 mb-4">
        <h1 className="font-semibold">Project: {category?.project?.name}</h1>

        <h1 className="font-semibold">Category: {category?.name}</h1>
      </div>

      <h2 className="text-xl font-semibold mb-4">Add New Task</h2>

      <div className="space-y-4">
        {/* Title */}

        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-3 py-2 rounded-lg"
        />

        {/* Description */}

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-3 py-2 rounded-lg"
        />

        {/* Recurrence */}

        <select
          value={recurrenceType}
          onChange={(e) => setRecurrenceType(e.target.value)}
          className="w-full border px-3 py-2 rounded-lg"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>

        {/* Weekly */}

        {recurrenceType === "weekly" && (
          <div className="flex gap-2 flex-wrap">
            {weekDays.map((day, index) => (
              <button
                key={index}
                onClick={() => toggleDay(index)}
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
            placeholder="Day of month"
            value={dayOfMonth}
            onChange={(e) => setDayOfMonth(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg"
          />
        )}

        {/* Start Date */}

        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="w-full border px-3 py-2 rounded-lg"
        />

        {/* End Date */}

        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="w-full border px-3 py-2 rounded-lg"
        />

        <button
          onClick={addTask}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
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
