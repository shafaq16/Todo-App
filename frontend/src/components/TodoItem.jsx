function TodoItem({ todo, onToggle, onDelete }) {
  return (
    <div>
      <h3>{todo.title}</h3>

      <p>{todo.description}</p>

      <p>Priority: {todo.priority}</p>

      <p>
        Status: {todo.completed ? "Completed" : "Pending"}
      </p>

      <button onClick={() => onToggle(todo)}>
        {todo.completed ? "Mark Pending" : "Mark Complete"}
      </button>

      <button onClick={() => onDelete(todo._id)}>
        Delete
      </button>

      <hr />
    </div>
  );
}

export default TodoItem;