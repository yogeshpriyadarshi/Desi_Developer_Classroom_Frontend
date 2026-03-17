import { useEffect, useState } from "react";
import axiosInstance from "../../../utils/axiosIntances";
import { toast } from "react-toastify";

function TaskLogViewer() {
  const [date, setDate] = useState(() => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localDate = new Date(today.getTime() - offset * 60 * 1000);
    return localDate.toISOString().split("T")[0];
  });

  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState({});

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

  // 🟢 Start Editing
  const handleEdit = (log) => {
    setEditingId(log._id);
    setEditData({
      status: log.status,
      productivity: log.productivity,
      urgency: log.urgency,
      timeSpent: log.timeSpent,
    });
  };

  // 🟢 Save Update
  const handleSave = async (id) => {
    try {
      await axiosInstance.put(`/task-management/task-log/${id}`, editData);

      toast.success("Task log updated successfully");

      setEditingId(null);
      fetchLogs(); // refresh data
    } catch (err) {
      console.error(err);
      toast.error("Failed to update task log");
    }
  };

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

      {/* Logs */}
      {!loading && logs.length > 0 && (
        <div className="space-y-4">
          {logs.map((log) => (
            <div
              key={log._id}
              className="bg-white shadow rounded-lg p-5 flex justify-between items-center"
            >
              <div className="w-full">
                <h2 className="font-semibold">{log.task?.title}</h2>
                {editingId === log._id ? (
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {/* description */}
                    <input
                      type="text"
                      value={editData.description}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          description: e.target.value,
                        })
                      }
                      className="border p-1 rounded"
                    />
                    <select
                      value={editData.status}
                      onChange={(e) =>
                        setEditData({ ...editData, status: e.target.value })
                      }
                      className="border p-1 rounded"
                    >
                      <option value="pending">pending</option>
                      <option value="in-progress">in-progress</option>
                      <option value="completed">completed</option>
                    </select>

                    <input
                      type="number"
                      placeholder="Productivity"
                      value={editData.productivity}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          productivity: Number(e.target.value),
                        })
                      }
                      className="border p-1 rounded w-24"
                    />

                    <input
                      type="number"
                      placeholder="Urgency"
                      value={editData.urgency}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          urgency: Number(e.target.value),
                        })
                      }
                      className="border p-1 rounded w-24"
                    />

                    <input
                      type="number"
                      placeholder="Time"
                      value={editData.timeSpent}
                      onChange={(e) =>
                        setEditData({
                          ...editData,
                          timeSpent: Number(e.target.value),
                        })
                      }
                      className="border p-1 rounded w-24"
                    />
                  </div>
                ) : (
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
                )}
              </div>

              <div className="text-right">
                {editingId === log._id ? (
                  <button
                    onClick={() => handleSave(log._id)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Save
                  </button>
                ) : (
                  <>
                    <p className="font-semibold">{log.timeSpent} min</p>
                    <button
                      onClick={() => handleEdit(log)}
                      className="text-blue-500 text-sm mt-2"
                    >
                      Edit
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty */}
      {!loading && logs.length === 0 && date && (
        <div className="bg-gray-50 text-center p-10 rounded-lg">
          <p className="text-gray-500">No logs found for this date</p>
        </div>
      )}
    </div>
  );
}

export default TaskLogViewer;
