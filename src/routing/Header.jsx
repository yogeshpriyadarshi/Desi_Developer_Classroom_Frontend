import { NavLink, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosIntances";
import { FaHome, FaSignOutAlt, FaUser } from "react-icons/fa";
import { use, useEffect, useState } from "react";

function Header() {
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState({});
  const navigate = useNavigate();

  const linkStyle =
    "flex items-center gap-2 px-4 py-2 rounded-lg transition-all";

  const fetchTopics = async (subjectId) => {
    try {
      const response = await axiosInstance.get(`/topics/fetch-by-subject/${subjectId}`);

      setTopics((prev) => ({
        ...prev,
        [subjectId]: response.data.topics,
      }));
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };

  const fetchSubjects = async () => {
    try {
      const response = await axiosInstance.get("/subjects");
      const subjectsData = response.data.subjects;

      setSubjects(subjectsData);

      // fetch topics for each subject
      subjectsData.forEach((sub) => {
        fetchTopics(sub._id);
      });

    } catch (error) {
      console.error("Error fetching subjects:", error);
    }
  };
  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <header className="bg-whiteshadow-md px-6 py-3 flex justify-between items-center">

      {/* Logo / Title */}
      <NavLink to="/" className="text-xl font-bold text-blue-600 mx-5 ">
        Desi Developer Classroom
      </NavLink>

      {/* Navigation */}
      <nav className="flex items-center gap-4">
        {subjects.map((subject) => (
          <div key={subject._id} className="relative group">

            <div className={`${linkStyle} text-blue-500 hover:bg-blue-50 cursor-pointer`}>
              {subject.name}
            </div>

            {/* Topics dropdown */}
            {topics[subject._id] && (
              <div className="absolute top-full left-0 bg-white shadow-md rounded-md hidden group-hover:block">
                {topics[subject._id].map((topic) => (
                  <NavLink
                    key={topic._id}
                    to={`/topics/${topic.slug}`}
                    className="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-700"
                  >
                    {topic.name}
                  </NavLink>
                ))}
              </div>
            )}

          </div>
        ))}
      </nav>
    </header>
  );
}

export default Header;