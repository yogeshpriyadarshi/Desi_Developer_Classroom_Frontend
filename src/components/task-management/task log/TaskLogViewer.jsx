import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosIntances";
import { toast } from "react-toastify";

function TaskLogViewer() {
  const [date, setDate] = useState("");
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    if (!date) return;

    try {
      setLoading(true);

      const res = await axiosInstance.get(
        `/task-management/task-log/date/${date}`,
      );

      setLogs(res.data.taskLogs || []);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch task logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [date]);

  // statistics
  const totalTime = logs.reduce((acc, log) => acc + (log.timeSpent || 0), 0);

  const avgProductivity =
    logs.length > 0
      ? (
          logs.reduce((acc, log) => acc + (log.productivity || 0), 0) /
          logs.length
        ).toFixed(1)
      : 0;

  const completedTasks = logs.filter(
    (log) => log.status === "completed",
  ).length;

  const statusColor = {
    completed: "bg-green-100 text-green-700",
    "in-progress": "bg-yellow-100 text-yellow-700",
    pending: "bg-gray-200 text-gray-700",
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}

      <div className="mb-6">
        <h1 className="text-3xl font-bold">Task Logs</h1>

        <p className="text-gray-500">View your daily productivity</p>
      </div>

      {/* Date Picker */}

      <div className="bg-white p-4 rounded-lg shadow mb-6 flex items-center gap-4">
        <label className="font-medium">Select Date</label>

        <input
          type="date"
          className="border p-2 rounded"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* Loading */}

      {loading && (
        <div className="text-gray-500 text-center py-10">Loading logs...</div>
      )}

      {/* Stats */}

      {!loading && logs.length > 0 && (
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Total Time Spent</p>
            <h2 className="text-2xl font-bold">{totalTime} min</h2>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Average Productivity</p>
            <h2 className="text-2xl font-bold">{avgProductivity}/10</h2>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-gray-500 text-sm">Completed Tasks</p>
            <h2 className="text-2xl font-bold">
              {completedTasks}/{logs.length}
            </h2>
          </div>
        </div>
      )}

      {/* Logs */}

      {!loading && logs.length > 0 && (
        <div className="space-y-4">
          {logs.map((log) => (
            <div
              key={log._id}
              className="bg-white shadow rounded-lg p-5 flex justify-between items-center"
            >
              <div>
                <h2 className="font-semibold">{log.task?.title}</h2>

                <div className="flex gap-2 mt-2">
                  <span
                    className={`text-xs px-2 py-1 rounded ${
                      statusColor[log.status]
                    }`}
                  >
                    {log.status}
                  </span>

                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    Productivity {log.productivity ?? "-"}
                  </span>

                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                    Urgency {log.urgency ?? "-"}
                  </span>
                </div>
              </div>

              <div className="text-right">
                <p className="text-gray-500 text-sm">Time Spent</p>

                <p className="font-semibold">{log.timeSpent} min</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}

      {!loading && logs.length === 0 && date && (
        <div className="bg-gray-50 text-center p-10 rounded-lg">
          <p className="text-gray-500">No logs found for this date</p>
        </div>
      )}
    </div>
  );
}

export default TaskLogViewer;
