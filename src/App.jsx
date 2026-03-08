import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Practice from "./components/practice/Practice";
import Quiz from "./components/quiz/Quiz";
import Study from "./components/study/Study";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import TodoList from "./components/todolist/TodoList";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Home />}>
          <Route path="study" element={<Study />} />
          <Route path="practice" element={<Practice />} />
          <Route path="quiz" element={<Quiz />} />
          <Route path="todolist" element={<TodoList />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
