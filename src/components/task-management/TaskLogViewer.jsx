import { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from "../../utils/axiosIntances";

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
      console.log(res.data);

      setLogs(res.data.taskLogs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [date]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Task Logs</h2>

      {/* Date Picker */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">Select Date</label>

        <input
          type="date"
          className="border p-2 rounded w-60"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* Loading */}
      {loading && <p className="text-gray-500">Loading logs...</p>}

      {/* Table */}
      {!loading && logs.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full border rounded-lg">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">Task</th>
                <th className="p-3 text-left">Status</th>
                <th className="p-3 text-left">Productivity</th>
                <th className="p-3 text-left">Urgency</th>
                <th className="p-3 text-left">Time Spent (min)</th>
              </tr>
            </thead>

            <tbody>
              {logs.map((log) => (
                <tr key={log._id} className="border-t hover:bg-gray-50">
                  <td className="p-3">{log.task?.title}</td>

                  <td className="p-3">
                    <span
                      className={`px-2 py-1 rounded text-sm ${
                        log.status === "completed"
                          ? "bg-green-100 text-green-700"
                          : log.status === "in-progress"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>

                  <td className="p-3">{log.productivity ?? "-"}</td>

                  <td className="p-3">{log.urgency ?? "-"}</td>

                  <td className="p-3">{log.timeSpent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Empty State */}
      {!loading && logs.length === 0 && date && (
        <p className="text-gray-500 mt-4">No logs found for this date.</p>
      )}
    </div>
  );
}

export default TaskLogViewer;
