import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route } from "react-router-dom";
import Home from "./routing/Home.jsx";
import Practice from "./components/practice/Practice";
import Quiz from "./components/quiz/Quiz";
import Study from "./components/study/Study";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import TodoList from "./components/todolist/TodoList";
import ProtectedRoute from "./routing/ProtectedRoute.jsx";
import PublicRoute from "./routing/PublicRoute.jsx";
import Profile from "./components/user/Profile";

import MyEditor from "./components/editor/MyEditor";
import TaskManagement from "./components/task-management/TaskManagement";
import Projects from "./components/task-management/project setup/Projects.jsx";
import TaskCategory from "./components/task-management/project setup/TaskCategory.jsx";
import AddTask from "./components/task-management/project setup/AddTask.jsx";
import DailyTaskUpdate from "./components/task-management/update task/DailyTaskUpdate.jsx";
import DailyTaskPerformance from "./components/task-management/update task/DailyTaskPerformance.jsx.jsx";
import TaskLogViewer from "./components/task-management/task log/TaskLogViewer.jsx";
import Quant from "./components/desi-quant/Quant.jsx";
import DesiHtml from "./components/desi-HTML/DesiHtml.jsx";
import DesiCSS from "./components/desi-CSS/DesiCSS.jsx";
import DesiJavascript from "./components/desi-Javascript/DesiJavascript.jsx";
import DesiReact from "./components/desi-React/DesiReact.jsx";
import DesiNode from "./components/desi-Node/DesiNode.jsx";
import DSA from "./components/desi-DSA/DSA.jsx";
import Interview from "./components/Interview/Interview.jsx";
import OnlineCoding from "./components/onlineCoding/OnlineCoding.jsx";
import PrivacyPolicy from "./components/PrivacyPolicy.jsx";
import About from "./components/About.jsx";
import Contact from "./components/Contact.jsx";
import ScreenRecorder from "./components/recoder/ScreenRecorder.jsx";
import DrawingCanvas from "./components/annotation/DrawingCanvas.jsx";
import VideoRecorder from "./components/recoder/VideoRecorder.jsx";
import ScreenCamAudioRecorder from "./components/recoder/ScreenCamAudioRecorder.jsx";

function App() {
  return (
    <>
      {/* your routes/components */}
         <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

        </Route>

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />}>
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
            <Route path="study" element={<Study />} />
            <Route path="practice" element={<Practice />} />
            <Route path="quant" element={<Quant />} />
            <Route path="desi-html" element={<DesiHtml />} />
            <Route path="desi-css" element={<DesiCSS />} />
            <Route path="desi-javascript" element={<DesiJavascript />} />
            <Route path="desi-react" element={<DesiReact />} />
            <Route path="desi-node" element={<DesiNode />} />
            <Route path="quiz" element={<Quiz />} />
            <Route path="todolist" element={<TodoList />} />
            <Route path="profile" element={<Profile />} />
            <Route path="dsa" element={<DSA />} />
            <Route path="interview" element={<Interview />} />
            <Route path="online-coding" element={<OnlineCoding />} />
            <Route path="recorder" element={<ScreenRecorder />} />
            <Route path="drawing" element={<DrawingCanvas />} />
            <Route path="video-recorder" element={<VideoRecorder />} />
            <Route path="screenandvideo-recorder" element={<ScreenCamAudioRecorder />} />

            {/* TASK PARENT ROUTE */}
            <Route path="task-management" element={<TaskManagement />}>
              <Route path="projects" element={<Projects />} />
              <Route path="task/:id" element={<AddTask />} />
              <Route path="category/:id" element={<TaskCategory />} />
              <Route path="daily-task-update" element={<DailyTaskUpdate />} />
              <Route
                path="daily-task-performance/:taskId"
                element={<DailyTaskPerformance />}
              />
              <Route path="task-log-viewer" element={<TaskLogViewer />} />
            </Route>

            <Route path="myeditor" element={<MyEditor />} />
          </Route>
        </Route>
      </Routes> 
  
   
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
