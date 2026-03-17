import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosIntances";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

function DailyTaskPerformance() {
  const { taskId } = useParams();

  const [task, setTask] = useState(null);
  const [description, setDescription] = useState("");

  const [status, setStatus] = useState("pending");
  const [productivity, setProductivity] = useState(5);
  const [urgency, setUrgency] = useState(5);
  const [timeSpent, setTimeSpent] = useState(0);

  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  // fetch task
  const getTask = async () => {
    try {
      const res = await axiosInstance.get(`/task-management/tasks/${taskId}`);

      if (res.data.success) {
        setTask(res.data.task);
      }
    } catch (err) {
      toast.error("Failed to load task");
    }
  };

  useEffect(() => {
    getTask();
  }, []);

  // validation
  const validateForm = () => {
    if (productivity < 1 || productivity > 10) {
      toast.warning("Productivity must be between 1 and 10");
      return false;
    }

    if (urgency < 1 || urgency > 10) {
      toast.warning("Urgency must be between 1 and 10");
      return false;
    }

    if (timeSpent < 0) {
      toast.warning("Time spent cannot be negative");
      return false;
    }

    return true;
  };

  const saveLog = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);

      await axiosInstance.post("/task-management/task-log", {
        task: taskId,
        description,
        status,
        productivity,
        urgency,
        timeSpent,
        date: today,
      });

      toast.success("Performance updated successfully 🎉");

      setProductivity(5);
      setUrgency(5);
      setTimeSpent(0);
      setStatus("pending");
    } catch (err) {
      toast.error("Failed to save performance");
    } finally {
      setLoading(false);
    }
  };

  if (!task)
    return (
      <div className="text-center mt-10 text-gray-500">Loading task...</div>
    );

  const priorityColor = {
    low: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    high: "bg-red-100 text-red-700",
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}

      <div className="bg-white shadow-md rounded-xl p-5 mb-6">
        <h1 className="text-2xl font-bold mb-2">Daily Task Performance</h1>

        <p className="text-gray-500 text-sm">{today}</p>

        <div className="mt-4">
          <h2 className="text-lg font-semibold">{task.title}</h2>

          <p className="text-gray-500 text-sm mt-1">{task.description}</p>

          <span
            className={`text-xs px-2 py-1 rounded mt-2 inline-block ${
              priorityColor[task.priority]
            }`}
          >
            {task.priority}
          </span>
        </div>
      </div>

      {/* Performance Form */}

      <div className="bg-white shadow-lg rounded-xl p-6 space-y-6">
        {/* descriptin */}

        <div>
          <label className="block font-medium mb-1">Description</label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
          ></textarea>
        </div>

        {/* Status */}

        <div>
          <label className="block font-medium mb-1">Status</label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Productivity */}

        <div>
          <label className="block font-medium mb-2">
            Productivity: {productivity}/10
          </label>

          <input
            type="range"
            min="1"
            max="10"
            value={productivity}
            onChange={(e) => setProductivity(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Urgency */}

        <div>
          <label className="block font-medium mb-2">
            Urgency: {urgency}/10
          </label>

          <input
            type="range"
            min="1"
            max="10"
            value={urgency}
            onChange={(e) => setUrgency(Number(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Time Spent */}

        <div>
          <label className="block font-medium mb-1">Time Spent (minutes)</label>

          <input
            type="number"
            min="0"
            value={timeSpent}
            onChange={(e) => setTimeSpent(Number(e.target.value))}
            className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Save */}

        <button
          onClick={saveLog}
          disabled={loading}
          className={`w-full py-2 rounded-lg text-white transition ${
            loading ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {loading ? "Saving..." : "Save Performance"}
        </button>
      </div>
    </div>
  );
}

export default DailyTaskPerformance;
