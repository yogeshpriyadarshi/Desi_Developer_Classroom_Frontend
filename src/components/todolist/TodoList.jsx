import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosIntances";
import { Link } from "react-router-dom";
function TodoList() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodos] = useState([]);
  const [day, setDay] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getTodos = async () => {
    try {
      const response = await axiosInstance.get(`/todolists/day/${day}`);
      console.log(response);
      setTodos(response.data.todoLists);
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };

  const toggleStatus = async (id) => {
    try {
      const response = await axiosInstance.patch(`/todolists/${id}/status`);
      console.log(response);
      getTodos();
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  };

  useEffect(() => {
    if (day) {
      getTodos();
    }
  }, [day]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      console.log(title, description);
      const response = await axiosInstance.post(`/todolists`, {
        title,
        description,
      });
      console.log(response);
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
    setLoading(false);
    setTitle("");
    setDescription("");
  };
  return (
    <>
      <div className="flex flex-col ">
        <h1 className="text-5xl font-bold m-10 text-yellow-500 text-center">
          TodoList
        </h1>
        <div>
          <h3 className="text-center font-bold m-2"> add To do lists</h3>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="todo"
              className="border border-gray-300 rounded-md p-2 m-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="description"
              className="border border-gray-300 rounded-md p-2 m-2"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <button
              type="submit"
              className="border border-gray-300 rounded-md p-2 m-2 bg-blue-500 cursor-pointer"
            >
              Add
            </button>
          </form>
        </div>

        <div>
          <h3 className="m-2 text-center font-bold">
            {" "}
            show to do list of particular day{" "}
          </h3>
          <div>
            <h4 className="font-bold">select date</h4>

            <input
              type="date"
              className="m-2"
              value={day}
              onChange={(e) => setDay(e.target.value)}
            />
          </div>

          <div>
            <table className="table-auto border border-gray-400 w-full">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Title</th>
                  <th className="border px-4 py-2">Description</th>
                  <th className="border px-4 py-2">status</th>
                </tr>
              </thead>

              <tbody>
                {todos.map((todo) => (
                  <tr key={todo._id}>
                    <td className="border px-4 py-2">{todo.title}</td>
                    <td className="border px-4 py-2">{todo.description}</td>
                    <td className="border px-4 py-2">
                      <button
                        className="px-3 py-1 rounded bg-blue-500 text-white"
                        onClick={() => toggleStatus(todo._id)}
                      >
                        {todo.status}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default TodoList;
