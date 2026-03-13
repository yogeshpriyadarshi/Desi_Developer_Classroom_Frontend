import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosIntances";
import { useParams } from "react-router-dom";

function DailyTaskPerformance() {
  const { taskId } = useParams();

  const [task, setTask] = useState(null);

  const [status, setStatus] = useState("pending");
  const [priority, setPriority] = useState("medium");
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
    }
  };

  useEffect(() => {
    getTask();
  }, []);

  const saveLog = async () => {
    try {
      await axiosInstance.post("/task-management/task-log", {
        task: taskId,
        status,
        priority,
        productivity,
        urgency,
        timeSpent,
        isCompleted,
        date: today,
      });

      alert("Performance updated");
    } catch (err) {
      console.log(err);
    }
  };

  if (!task) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Update Daily Performance</h1>

      <div className="bg-white shadow-md p-6 rounded-lg space-y-4">
        <h2 className="text-lg font-semibold">{task.title}</h2>

        {/* Status */}
        <div>
          <label className="block mb-1 font-medium">Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Priority */}
        <div>
          <label className="block mb-1 font-medium">Priority</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full border rounded p-2"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>

        {/* Productivity */}
        <div>
          <label className="block mb-1 font-medium">Productivity (1-10)</label>
          <input
            type="number"
            min="1"
            max="10"
            value={productivity}
            onChange={(e) => setProductivity(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        {/* Urgency */}
        <div>
          <label className="block mb-1 font-medium">Urgency (1-10)</label>
          <input
            type="number"
            min="1"
            max="10"
            value={urgency}
            onChange={(e) => setUrgency(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        {/* Time Spent */}
        <div>
          <label className="block mb-1 font-medium">Time Spent (minutes)</label>
          <input
            type="number"
            min="0"
            value={timeSpent}
            onChange={(e) => setTimeSpent(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>

        {/* Completed */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={(e) => setIsCompleted(e.target.checked)}
          />
          <label>Mark as Completed</label>
        </div>

        {/* Button */}
        <button
          onClick={saveLog}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
        >
          Save Performance
        </button>
      </div>
    </div>
  );
}

export default DailyTaskPerformance;
