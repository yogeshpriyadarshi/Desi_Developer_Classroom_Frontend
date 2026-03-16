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

  // Fetch Subjects
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

  // Fetch Topics
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

  // fetch question
  useEffect(() => {
    if (!topicId || !difficulty) return;

    const fetchQuestions = async () => {
      try {
        const res = await axiosInstance.get(
          `/questions/fetch-by-topic/${topicId}?difficulty=${difficulty}&status=active`,
        );

        setQuestions(res.data.questions);
        setCurrentIndex(0);

        toast.success("Questions loaded");
      } catch {
        toast.error("Failed to load questions");
      }
    };

    fetchQuestions();
  }, [topicId, difficulty]);

  const handleAnswer = (option, index) => {
    setSelectedAnswer(index);
    setShowExplanation(true);

    if (index === questions[currentIndex].correctAnswer) {
      toast.success("Correct Answer 🎉");
    } else {
      toast.error("Wrong Answer ❌");
    }
  };

  const handleNext = () => {
    setCurrentIndex((prev) => prev + 1);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const question = questions[currentIndex];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-4xl font-bold text-center text-yellow-500 mb-8">
        Practice
      </h1>

      {/* Subject + Topic */}

      <div className="flex gap-4 justify-center mb-8">
        <select
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          className="border p-2 rounded-md"
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
          className="border p-2 rounded-md"
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
          className="border p-2 rounded-md"
        >
          <option value="">Select Difficulty</option>
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {/* Question */}

      {question && (
        <div className="bg-white shadow-lg rounded-xl p-6">
          <p className="text-lg font-semibold mb-6">
            Q{currentIndex + 1}. {question.questionText}
          </p>

          <div className="grid gap-3">
            {question.options.map((option, i) => (
              <button
                key={i}
                onClick={() => handleAnswer(option, i)}
                disabled={showExplanation}
                className={`p-3 border rounded-lg text-left hover:bg-gray-100

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
            <div className="mt-6 p-4 bg-gray-50 border rounded-md">
              {selectedAnswer === question.correctAnswer ? (
                <p className="text-green-600 font-semibold">Correct ✅</p>
              ) : (
                <p className="text-red-600 font-semibold">
                  Wrong ❌ | Correct Answer: Option {question.correctAnswer + 1}
                </p>
              )}

              <p className="mt-2">
                <strong>Explanation:</strong> {question.explanation}
              </p>

              {currentIndex < questions.length - 1 && (
                <button
                  onClick={handleNext}
                  className="mt-4 px-5 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Next →
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Practice;
