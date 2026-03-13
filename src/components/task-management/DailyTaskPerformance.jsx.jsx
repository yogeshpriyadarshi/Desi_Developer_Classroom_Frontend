import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosIntances";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

function DailyTaskPerformance() {
  const { taskId } = useParams();

  const [task, setTask] = useState(null);

  const [status, setStatus] = useState("pending");
  const [productivity, setProductivity] = useState(5);
  const [urgency, setUrgency] = useState(5);
  const [timeSpent, setTimeSpent] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  // fetch task
  const getTask = async () => {
    try {
      const res = await axiosInstance.get(`/task-management/tasks/${taskId}`);

      if (res.data.success) {
        setTask(res.data.task);
      }
    } catch (err) {
      console.log(err);
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
      await axiosInstance.post("/task-management/task-log", {
        task: taskId,
        status,
        productivity,
        urgency,
        timeSpent,
        isCompleted,
        date: today,
      });

      toast.success("Performance updated successfully");

      // optional reset
      setProductivity(5);
      setUrgency(5);
      setTimeSpent(0);
      setIsCompleted(false);
    } catch (err) {
      console.log(err);
      toast.error("Failed to save performance");
    }
  };

  if (!task) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Update Daily Performance</h1>

      <div className="bg-white shadow-md p-6 rounded-lg space-y-5">
        <h2 className="text-lg font-semibold text-gray-700">{task.title}</h2>

        {/* Status */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">Status</label>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-400"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Productivity */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Productivity (1 - 10)
          </label>

          <input
            type="number"
            min="1"
            max="10"
            value={productivity}
            onChange={(e) => setProductivity(Number(e.target.value))}
            className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Urgency */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Urgency (1 - 10)
          </label>

          <input
            type="number"
            min="1"
            max="10"
            value={urgency}
            onChange={(e) => setUrgency(Number(e.target.value))}
            className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Time Spent */}
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Time Spent (minutes)
          </label>

          <input
            type="number"
            min="0"
            value={timeSpent}
            onChange={(e) => setTimeSpent(Number(e.target.value))}
            className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-400"
          />
        </div>

        {/* Completed */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={(e) => setIsCompleted(e.target.checked)}
          />
          <label className="text-gray-700">Mark as Completed</label>
        </div>

        {/* Save Button */}
        <button
          onClick={saveLog}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Save Performance
        </button>
      </div>
    </div>
  );
}

export default DailyTaskPerformance;
