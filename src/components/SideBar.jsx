import { Link } from "react-router-dom";
function SideBar() {
  const sidebar = ["study", "practice", "quiz", "todolist"];
  return (
    <>
      <div className="flex flex-col">
        {sidebar.map((item) => (
          <Link
            className="text-blue-500 text-2xl border border-blue-500 p-2 rounded-md"
            to={item}
          >
            {item}
          </Link>
        ))}
      </div>
    </>
  );
}

export default SideBar;
