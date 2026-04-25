import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosIntances";
import Editor from "@monaco-editor/react";

function DSA() {
  const [subjectId, setSubjectId] = useState("");
  const [topic, setTopic] = useState([]);
  const [topicId, setTopicId] = useState("");
  const [difficulty, setDifficulty] = useState("");

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
    const res = await axiosInstance.get(`/dsa/${topicId}`, {
      params: {
        difficulty,
      },
    });
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
  }, [topicId, difficulty]);

  const getDifficultyColor = (level) => {
    if (level === "easy") return "bg-green-100 text-green-600";
    if (level === "medium") return "bg-yellow-100 text-yellow-600";
    if (level === "hard") return "bg-red-100 text-red-600";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">List of DSA Questions</h1>

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
        {/* difficulty filter */}
        <select
          className="border px-4 py-2 rounded-lg shadow-sm"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="">Select Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
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
                className="border rounded-2xl p-5 shadow hover:shadow-lg transition"
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
                    {/* source and sourceLink */}
                    <span className="text-sm">{item.source}</span>
                    <a
                      href={item.sourceLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <button className="text-sm cursor-pointer">View</button>
                    </a>

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
                    {/* Explanation */}
                    <div className=" p-4 rounded-xl">
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
