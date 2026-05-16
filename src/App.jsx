import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [search, setSearch] = useState("");

  const fetchTasks = async () => {
    const res = await axios.get("https://todo-app-backend-mu-six.vercel.app/");
    setTasks(res.data.reverse());
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async () => {
    if (!title.trim()) return;

    await axios.post("https://todo-app-backend-mu-six.vercel.app/", {
      title,
      note,
    });

    setTitle("");
    setNote("");
    fetchTasks();
  };

  const deleteTask = async (id) => {
    await axios.delete(`https://todo-app-backend-mu-six.vercel.app/${id}`);
    fetchTasks();
  };

  const toggleTask = async (task) => {
    await axios.put(`https://todo-app-backend-mu-six.vercel.app/${task._id}`, {
      completed: !task.completed,
    });

    fetchTasks();
  };

  const filtered = tasks.filter((task) =>
    `${task.title} ${task.note}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const pendingTasks = filtered.filter((task) => !task.completed);
  const completedTasks = filtered.filter((task) => task.completed);

  return (
    <div className="container">
      <div className="card">
        <h1>✨ Smart ToDo</h1>

        <p className="subtitle">
          Pending: {pendingTasks.length} | Completed: {completedTasks.length}
        </p>

        <div className="inputBox">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title..."
          />
          <button onClick={addTask}>Add</button>
        </div>

        <div className="inputBox">
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Write note..."
          />
        </div>

        <div className="inputBox">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search title or note..."
          />
        </div>

        <h2 className="sectionTitle">⏳ Pending Tasks</h2>

        {pendingTasks.length === 0 ? (
          <p className="empty">No pending tasks</p>
        ) : (
          pendingTasks.map((task) => (
            <div className="task" key={task._id}>
              <div className="leftPart">
                <div>
                  <span>{task.title}</span>
                  <p>{task.note}</p>
                </div>
              </div>

              <div className="btnGroup">
                <button onClick={() => toggleTask(task)}>Complete</button>
                <button onClick={() => deleteTask(task._id)}>Delete</button>
              </div>
            </div>
          ))
        )}

        <h2 className="sectionTitle">✅ Completed Tasks</h2>

        {completedTasks.length === 0 ? (
          <p className="empty">No completed tasks</p>
        ) : (
          completedTasks.map((task) => (
            <div className="task done" key={task._id}>
              <div className="leftPart">
                <div>
                  <span>{task.title}</span>
                  <p>{task.note}</p>
                </div>
              </div>

              <div className="btnGroup">
                <button onClick={() => toggleTask(task)}>Pending</button>
                <button onClick={() => deleteTask(task._id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;