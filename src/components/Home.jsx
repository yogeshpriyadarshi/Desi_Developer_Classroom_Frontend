import { Link, Outlet, useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosIntances";
import { useState } from "react";
import SideBar from "./SideBar";
import Header from "./Header";

function Home() {
  const [error, setError] = useState("");
  const navigate = useNavigate(); // ✅ correct hook

  return (
    <>
      <div className="flex justify-between m-10">
        <Header />
      </div>

      <div className="flex m-10 gap justify-around ">
        <SideBar />
        <Outlet />
      </div>
    </>
  );
}

export default Home;
