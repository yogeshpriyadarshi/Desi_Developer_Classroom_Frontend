import { useState, useEffect } from "react";
import axios from "axios";
import axiosInstance from "../../utils/axiosIntances";

function Practice() {
  const [subjects, setSubjects] = useState([]);
  const [subjectId, setSubjectId] = useState("");
  const [topics, setTopics] = useState([]);
  const [topicId, setTopicId] = useState("");
  const [concepts, setConcepts] = useState([]);
  const [conceptId, setConceptId] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  useEffect(() => {
    //fetch subject axios
    const fetchSubject = async () => {
      const response = await axiosInstance.get(`/subjects/fetch-all`);
      setSubjects(response.data.subjects);
    };
    fetchSubject();
  }, []);
  useEffect(() => {
    //fetch topic axios

    if (subjectId) {
      const fetchTopicBySubject = async () => {
        const response = await axiosInstance.get(
          `/topics/fetch-by-subject/${subjectId}`,
        );
        setTopics(response.data.topics);
      };
      fetchTopicBySubject();
    }
  }, [subjectId]);

  useEffect(() => {
    //fetch concept axios
    if (topicId) {
      const fetchConceptByTopic = async () => {
        const response = await axiosInstance.get(
          `/concepts/fetch-by-topic/${topicId}`,
        );
        setConcepts(response.data.concepts);
      };
      fetchConceptByTopic();
    }
  }, [topicId]);

  useEffect(() => {
    //fetch questions axios
    if (conceptId) {
      const fetchQuestionsByConcept = async () => {
        const response = await axiosInstance.get(
          `/questions/fetch-by-concept/${conceptId}`,
        );
        setQuestions(response.data.questions);
      };
      fetchQuestionsByConcept();
    }
  }, [conceptId]);

  const handleAnswer = (option) => {
    setSelectedAnswer(option);
    setShowExplanation(true);
  };
  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };
  return (
    <>
      <h1 className="text-5xl font-bold m-10 text-yellow-500 text-center">
        Practice
      </h1>
      <div className="flex justify-center">
        <select
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          className="border border-gray-300 rounded-md p-2 m-2"
        >
          <option value="">Select Subject</option>
          {subjects.map((subject) => (
            <option key={subject._id} value={subject._id}>
              {subject.subjectName}
            </option>
          ))}
        </select>
        <select
          value={topicId}
          onChange={(e) => setTopicId(e.target.value)}
          className="border border-gray-300 rounded-md p-2 m-2"
        >
          <option value="">Select Topic</option>
          {topics.map((topic) => (
            <option key={topic._id} value={topic._id}>
              {topic.topicName}
            </option>
          ))}
        </select>
        <select
          value={conceptId}
          onChange={(e) => setConceptId(e.target.value)}
          className="border border-gray-300 rounded-md p-2 m-2"
        >
          <option value="">Select Concept</option>
          {concepts.map((concept) => (
            <option key={concept._id} value={concept._id}>
              {concept.conceptName}
            </option>
          ))}
        </select>
      </div>
      {/* show one question at a time, button for next , also show explain after attempting a question */}
      <div>
        {questions.length > 0 && (
          <div>
            <p>
              Q{currentIndex + 1}. {questions[currentIndex].question}
            </p>

            {questions[currentIndex].options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(option)}
                disabled={showExplanation}
              >
                {option}
              </button>
            ))}

            {showExplanation && (
              <div>
                {selectedAnswer === questions[currentIndex].correctAnswer ? (
                  <p style={{ color: "green" }}>Correct ✅</p>
                ) : (
                  <p style={{ color: "red" }}>
                    Wrong ❌ | Correct Answer:{" "}
                    {questions[currentIndex].correctAnswer}
                  </p>
                )}

                <p>
                  <strong>Explanation:</strong>{" "}
                  {questions[currentIndex].explanation}
                </p>

                {currentIndex < questions.length - 1 && (
                  <button onClick={handleNext}>Next</button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Practice;
