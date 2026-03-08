import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import Header from "./Header";

function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="shadow-md">
        <Header />
      </header>

      {/* Main Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-56 bg-gray-100 border-r p-4">
          <SideBar />
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Home;
