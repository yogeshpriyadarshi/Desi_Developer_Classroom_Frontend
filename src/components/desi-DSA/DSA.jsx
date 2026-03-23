import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosIntances";

function DSA() {
  const [subject, setSubject] = useState([]);
  const [topic, setTopic] = useState([]);
  const [subjectId, setSubjectId] = useState("");
  const [topicId, setTopicId] = useState("");

  const [dsa, setDsa] = useState([]);
  const [activeExplanation, setActiveExplanation] = useState(null);

  // ✅ Fetch subjects
  const getSubject = async () => {
    const response = await axiosInstance.get("/subjects");
    setSubject(response.data.subjects);

    const dsaSubject = response.data.subjects.find((s) => s.name === "DSA");
    if (dsaSubject) setSubjectId(dsaSubject._id);
  };

  // ✅ Fetch topics
  const getTopic = async () => {
    const response = await axiosInstance.get(
      `/topics/fetch-by-subject/${subjectId}`,
    );
    setTopic(response.data.topics);
  };

  // ✅ Fetch DSA questions
  const getDsa = async () => {
    if (!topicId) return;
    const response = await axiosInstance.get(`/dsa/${topicId}`);
    setDsa(response.data.dsas);
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

  return (
    <div className="p-6 flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">DSA Practice</h1>

        <select
          className="border border-gray-300 rounded-md px-4 py-2"
          value={topicId}
          onChange={(e) => setTopicId(e.target.value)}
        >
          <option value="">Select Topic</option>
          {topic.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {/* Questions */}
      <div className="flex flex-col gap-4">
        {dsa.length === 0 ? (
          <p className="text-gray-500">No questions available</p>
        ) : (
          dsa.map((item, index) => (
            <div
              key={item._id}
              className="border rounded-xl p-4 shadow-sm bg-white hover:shadow-md transition"
            >
              {/* Question */}
              <div className="flex justify-between items-start">
                <h2 className="font-semibold text-lg mb-2">Q{index + 1}</h2>

                <button
                  className="text-sm px-3 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600"
                  onClick={() =>
                    setActiveExplanation(
                      activeExplanation === item._id ? null : item._id,
                    )
                  }
                >
                  {activeExplanation === item._id ? "Hide" : "Show"} Explanation
                </button>
              </div>

              {/* Render HTML Question */}
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: item.question }}
              />

              {/* Explanation */}
              {activeExplanation === item._id && (
                <div className="mt-4 p-4 border-t bg-gray-50 rounded-md">
                  <h3 className="font-semibold mb-2 text-gray-700">
                    Explanation
                  </h3>

                  <div
                    className="prose max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: item.explanation,
                    }}
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DSA;
