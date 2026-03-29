import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosIntances";
import Editor from "@monaco-editor/react";

function DSA() {
  const [subjectId, setSubjectId] = useState("");
  const [topic, setTopic] = useState([]);
  const [topicId, setTopicId] = useState("");

  const [dsa, setDsa] = useState([]);
  const [activeQuestion, setActiveQuestion] = useState(null);

  const [codeMap, setCodeMap] = useState({});
  const [outputMap, setOutputMap] = useState({});
  const [loadingMap, setLoadingMap] = useState({});

  // Fetch Subjects
  const getSubject = async () => {
    const res = await axiosInstance.get("/subjects");
    const dsaSub = res.data.subjects.find((s) => s.name === "DSA");
    if (dsaSub) setSubjectId(dsaSub._id);
  };

  // Fetch Topics
  const getTopic = async () => {
    const res = await axiosInstance.get(
      `/topics/fetch-by-subject/${subjectId}`,
    );
    setTopic(res.data.topics);
  };

  // Fetch Questions
  const getDsa = async () => {
    if (!topicId) return;
    const res = await axiosInstance.get(`/dsa/${topicId}`);
    setDsa(res.data.dsas);
  };

  useEffect(() => {
    getSubject();
  }, []);

  useEffect(() => {
    if (subjectId) getTopic();
  }, [subjectId]);

  useEffect(() => {
    if (topicId) getDsa();
  }, [topicId]);

  const getDifficultyColor = (level) => {
    if (level === "easy") return "bg-green-100 text-green-600";
    if (level === "medium") return "bg-yellow-100 text-yellow-600";
    if (level === "hard") return "bg-red-100 text-red-600";
    return "bg-gray-100 text-gray-600";
  };

  const runCode = async (id) => {
    try {
      setLoadingMap((prev) => ({ ...prev, [id]: true }));

      const res = await axiosInstance.post("/run", {
        code: codeMap[id] || "",
        language: "javascript",
      });

      setOutputMap((prev) => ({
        ...prev,
        [id]: res.data.output || "No output",
      }));
    } catch {
      setOutputMap((prev) => ({
        ...prev,
        [id]: "Error running code",
      }));
    } finally {
      setLoadingMap((prev) => ({ ...prev, [id]: false }));
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">🚀 DSA Practice</h1>

        <select
          className="border px-4 py-2 rounded-lg shadow-sm"
          value={topicId}
          onChange={(e) => setTopicId(e.target.value)}
        >
          <option value="">Select Topic</option>
          {topic.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {dsa.length === 0 ? (
          <p className="text-gray-500">No questions available</p>
        ) : (
          dsa.map((item, index) => {
            const isOpen = activeQuestion === item._id;

            return (
              <div
                key={item._id}
                className="border rounded-2xl p-5 bg-white shadow hover:shadow-lg transition"
              >
                {/* Header */}
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => setActiveQuestion(isOpen ? null : item._id)}
                >
                  <h2 className="font-semibold text-lg">
                    Q{index + 1}. {item.title}
                  </h2>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${getDifficultyColor(
                        item.difficulty,
                      )}`}
                    >
                      {item.difficulty}
                    </span>

                    <span className="text-sm">{isOpen ? "▲" : "▼"}</span>
                  </div>
                </div>

                {/* Expanded */}
                {isOpen && (
                  <div className="mt-4 space-y-6">
                    {/* Question */}
                    <div
                      className="prose max-w-none"
                      dangerouslySetInnerHTML={{ __html: item.question }}
                    />

                    {/* Editor */}
                    <div className="bg-gray-900 rounded-xl p-4">
                      <Editor
                        height="250px"
                        defaultLanguage="javascript"
                        value={codeMap[item._id] || ""}
                        onChange={(val) =>
                          setCodeMap((prev) => ({
                            ...prev,
                            [item._id]: val,
                          }))
                        }
                        theme="vs-dark"
                      />

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          runCode(item._id);
                        }}
                        className="mt-3 bg-green-500 px-4 py-2 rounded-lg text-white hover:bg-green-600"
                      >
                        {loadingMap[item._id] ? "Running..." : "Run Code"}
                      </button>

                      <div className="mt-3 bg-black text-green-400 p-3 rounded-lg min-h-[60px]">
                        <pre>{outputMap[item._id]}</pre>
                      </div>
                    </div>

                    {/* Explanation */}
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <h3 className="font-semibold mb-2">Explanation</h3>
                      <div
                        className="prose max-w-none"
                        dangerouslySetInnerHTML={{
                          __html: item.explanation,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default DSA;
