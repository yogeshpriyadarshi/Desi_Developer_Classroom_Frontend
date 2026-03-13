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
import Profile from "./components/user/Profile";

import TaskCategory from "./components/task-management/TaskCategory";
import AddTask from "./components/task-management/AddTask";

import MyEditor from "./components/editor/MyEditor";
import TaskManagement from "./components/task-management/TaskManagement";
import Projects from "./components/task-management/Projects";
import DailyTaskViewer from "./components/task-management/DailyTaskViewer";
import DailyTaskPerformance from "./components/task-management/DailyTaskPerformance.jsx";

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
          <Route path="profile" element={<Profile />} />

          {/* TASK PARENT ROUTE */}
          <Route path="task-management" element={<TaskManagement />}>
            <Route path="projects" element={<Projects />} />
            <Route path="task/:id" element={<AddTask />} />
            <Route path="category/:id" element={<TaskCategory />} />
            <Route path="daily-task-viewer" element={<DailyTaskViewer />} />
            <Route
              path="daily-task-performance/:taskId"
              element={<DailyTaskPerformance />}
            />
          </Route>

          <Route path="myeditor" element={<MyEditor />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
