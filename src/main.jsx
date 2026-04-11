import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ModalProvider } from "./context/ModelContext.jsx";

document.documentElement.classList.toggle("dark")

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <ModalProvider>
          <div className="bg-white dark:bg-gray-900 text-black dark:text-white min-h-screen">
                    <App />
          </div>
        </ModalProvider>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
