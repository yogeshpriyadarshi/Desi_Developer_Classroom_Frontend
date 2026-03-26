import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosIntances";

function Interview() {
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [subjectId, setSubjectId] = useState("");
  const [topicId, setTopicId] = useState("");

  const [interviews, setInterviews] = useState([]);

  const [question, setQuestion] = useState("");
  const [explanation, setExplanation] = useState("");

  // Fetch subjects
  const getSubjects = async () => {
    const res = await axiosInstance.get("/subjects");
    setSubjects(res.data.subjects);
  };

  // Fetch topics
  const getTopics = async () => {
    const res = await axiosInstance.get(
      `/topics/fetch-by-subject/${subjectId}`,
    );
    setTopics(res.data.topics);
  };

  // Fetch interview questions
  const getInterviews = async () => {
    const res = await axiosInstance.get(`/interview/fetch-by-topic/${topicId}`);
    setInterviews(res.data.interviews);
  };

  useEffect(() => {
    getSubjects();
  }, []);

  useEffect(() => {
    if (subjectId) getTopics();
  }, [subjectId]);

  useEffect(() => {
    if (topicId) getInterviews();
  }, [topicId]);

  return (
    <div className="p-6 max-w-5xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Interview</h1>

        {/* Filters */}
        <div className="flex gap-3">
          <select
            className="border px-3 py-2 rounded-lg"
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
          >
            <option value="">All Subjects</option>
            {subjects.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>

          <select
            className="border px-3 py-2 rounded-lg"
            value={topicId}
            onChange={(e) => setTopicId(e.target.value)}
          >
            <option value="">All Topics</option>
            {topics.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Interview List */}
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-semibold">Interview Questions</h2>

        {interviews.map((item) => (
          <div
            key={item._id}
            className="bg-white shadow-md rounded-2xl p-5 flex flex-col gap-3"
          >
            {/* Question */}
            <div
              className="prose max-w-none text-gray-700"
              dangerouslySetInnerHTML={{
                __html: item.question,
              }}
            />

            {/* Explanation (HTML Render) */}
            <div
              className="prose max-w-none text-gray-700"
              dangerouslySetInnerHTML={{
                __html: item.explanation,
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Interview;
