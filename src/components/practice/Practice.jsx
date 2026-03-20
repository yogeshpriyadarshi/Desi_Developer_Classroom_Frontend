import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosIntances";
import { toast } from "react-toastify";

function Practice() {
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);

  const [subjectId, setSubjectId] = useState("");
  const [topicId, setTopicId] = useState("");
  const [difficulty, setDifficulty] = useState("");

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const res = await axiosInstance.get("/subjects/fetch-all");
        setSubjects(res.data.subjects);
      } catch {
        toast.error("Failed to load subjects");
      }
    };
    fetchSubjects();
  }, []);

  useEffect(() => {
    if (!subjectId) return;

    const fetchTopics = async () => {
      try {
        const res = await axiosInstance.get(
          `/topics/fetch-by-subject/${subjectId}`,
        );
        setTopics(res.data.topics);
        setTopicId("");
        setQuestions([]);
      } catch {
        toast.error("Failed to load topics");
      }
    };

    fetchTopics();
  }, [subjectId]);

  useEffect(() => {
    if (!topicId || !difficulty) return;

    const fetchQuestions = async () => {
      try {
        const res = await axiosInstance.get(
          `/questions/fetch-by-topic/${topicId}?difficulty=${difficulty}&status=active`,
        );

        setQuestions(res.data.questions);
        setCurrentIndex(0);
        setSelectedAnswer(null);
        setShowExplanation(false);

        toast.success("Questions loaded");
      } catch {
        toast.error("Failed to load questions");
      }
    };

    fetchQuestions();
  }, [topicId, difficulty]);

  const handleAnswer = (index) => {
    setSelectedAnswer(index);
    setShowExplanation(true);

    if (index === questions[currentIndex].correctAnswer) {
      toast.success("Correct Answer 🎉");
    } else {
      toast.error("Wrong Answer ❌");
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      resetState();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      resetState();
    }
  };

  const resetState = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const question = questions[currentIndex];

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <h1 className="text-2xl sm:text-4xl font-bold text-center text-yellow-500 mb-6">
        Practice
      </h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6">
        <select
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          className="border p-2 rounded-md w-full sm:w-auto"
        >
          <option value="">Select Subject</option>
          {subjects.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          value={topicId}
          onChange={(e) => setTopicId(e.target.value)}
          className="border p-2 rounded-md w-full sm:w-auto"
        >
          <option value="">Select Topic</option>
          {topics.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>

        <select
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="border p-2 rounded-md w-full sm:w-auto"
        >
          <option value="">Select Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {/* Question */}
      {question && (
        <div className="bg-white shadow-lg rounded-xl p-4 sm:p-6">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm sm:text-lg font-semibold">
              Question {currentIndex + 1} / {questions.length}
            </p>
          </div>

          <p className="text-base sm:text-lg font-semibold mb-4">
            {question.questionText}
          </p>

          <div className="grid gap-3">
            {question.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(i)}
                disabled={showExplanation}
                className={`p-3 border rounded-lg text-left hover:bg-gray-100 text-sm sm:text-base

                ${
                  showExplanation && i === question.correctAnswer
                    ? "bg-green-200 border-green-400"
                    : ""
                }

                ${
                  showExplanation &&
                  selectedAnswer === i &&
                  i !== question.correctAnswer
                    ? "bg-red-200 border-red-400"
                    : ""
                }
                `}
              >
                {option}
              </button>
            ))}
          </div>

          {showExplanation && (
            <div className="mt-5 p-4 bg-gray-50 border rounded-md">
              {selectedAnswer === question.correctAnswer ? (
                <p className="text-green-600 font-semibold">Correct ✅</p>
              ) : (
                <p className="text-red-600 font-semibold">
                  Wrong ❌ | Correct Answer: Option {question.correctAnswer + 1}
                </p>
              )}

              <p className="mt-2 text-sm sm:text-base">
                <strong>Explanation:</strong> {question.explanation}
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-6 gap-3">
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              className="px-4 py-2 bg-gray-400 text-white rounded-md disabled:opacity-50"
            >
              ← Previous
            </button>

            <button
              onClick={handleNext}
              disabled={currentIndex === questions.length - 1}
              className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Practice;
