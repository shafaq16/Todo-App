import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Todos() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const navigate = useNavigate();

  // Get all todos
  const fetchTodos = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/todos", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTodos(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch todos when page loads
  useEffect(() => {
    fetchTodos();
  }, []);

  // Create todo
  const handleCreateTodo = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");

    try {
      const token = localStorage.getItem("token");

      const response = await api.post(
        "/todos",
        {
          title,
          description,
          priority,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setTodos((prevTodos) => [response.data.data, ...prevTodos]);

      setTitle("");
      setDescription("");
      setPriority("medium");
    } catch (error) {
      console.log(error);
      setFormError(error.response?.data?.message || "Failed to create todo");
    } finally {
      setSubmitting(false);
    }
  };

  // Mark todo completed
  const handleToggleTodo = async (todo) => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.put(
        `/todos/${todo._id}`,
        {
          completed: !todo.completed,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setTodos((prevTodos) =>
        prevTodos.map((item) => (item._id === todo._id ? response.data : item)),
      );
    } catch (error) {
      console.log(error);
    }
  };

  // Delete todo
  const handleDeleteTodo = async (id) => {
    try {
      const token = localStorage.getItem("token");

      await api.delete(`/todos/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <div className="app-header">
        <h1>My Todos</h1>
        <button className="btn btn-secondary" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <form className="todo-form" onSubmit={handleCreateTodo}>
        <div className="todo-form-row">
          <div className="field">
            <label htmlFor="todo-title">Title</label>
            <input
              id="todo-title"
              type="text"
              placeholder="What needs doing?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="todo-form-row">
          <div className="field">
            <label htmlFor="todo-description">Description</label>
            <input
              id="todo-description"
              type="text"
              placeholder="Optional details"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <div className="todo-form-row-bottom">
          <div className="field priority-field">
            <label htmlFor="todo-priority">Priority</label>
            <select
              id="todo-priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={submitting}
          >
            {submitting ? "Adding..." : "Add Todo"}
          </button>
        </div>

        {formError && <p className="form-error">{formError}</p>}
      </form>

      {todos.length === 0 ? (
        <p className="empty-state">No todos yet — add your first one above.</p>
      ) : (
        <div className="todo-list">
          {todos.map((todo) => (
            <div
              key={todo._id}
              className={`todo-item priority-${todo.priority} ${
                todo.completed ? "is-completed" : ""
              }`}
            >
              <div className="todo-body">
                <div className="todo-title-row">
                  <span className="todo-title">{todo.title}</span>
                </div>

                {todo.description && (
                  <p className="todo-description">{todo.description}</p>
                )}

                <div className="todo-meta">
                  <span className={`badge badge-${todo.priority}`}>
                    {todo.priority}
                  </span>
                  <span className="badge badge-status">
                    {todo.completed ? "Completed" : "Pending"}
                  </span>
                </div>
              </div>

              <div className="todo-actions">
                <button
                  className={`btn btn-toggle ${todo.completed ? "is-complete" : ""}`}
                  onClick={() => handleToggleTodo(todo)}
                >
                  {todo.completed ? "Mark pending" : "Mark complete"}
                </button>

                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteTodo(todo._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Todos;
