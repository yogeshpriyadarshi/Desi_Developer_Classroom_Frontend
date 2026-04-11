// ======================= Home.jsx =======================
import { useState } from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import Header from "./Header";
import Footer from "./Footer";

function Home() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="shadow-md flex items-center px-4">
        <button className="md:hidden p-2" onClick={() => setIsOpen(true)}>
          ☰
        </button>
        <Header />
      </header>

      {/* Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
      <aside
  className={`fixed md:static top-0 left-0 h-full z-50  border-r p-2
  transform transition-transform duration-300
  ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
>
  <SideBar closeSidebar={() => setIsOpen(false)} />
</aside>

        {/* Overlay */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-40 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
