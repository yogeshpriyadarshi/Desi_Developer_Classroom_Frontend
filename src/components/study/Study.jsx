import { useEffect, useState } from "react";

function Study() {
  const [subjects, setSubjects] = useState();
  const [subjectId, setSubjectId] = useState();

  const BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    function fetchSubject() {
      try {
      } catch (err) {}
    }
    fetchSubject();
  }, []);

  return <></>;
}

export default Study;
