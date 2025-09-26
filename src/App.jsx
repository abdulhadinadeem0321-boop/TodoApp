import React, { useState, useEffect } from "react";

export default function TodoApp() {
  // State to store todos
  const [todos, setTodos] = useState(() => {
    // Get saved todos from localStorage (if any)
    const saved = localStorage.getItem("todos");
    return saved ? JSON.parse(saved) : [];
  });

  const [task, setTask] = useState("");

  // Save todos in localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  // Add new todo
  const addTodo = () => {
    if (task.trim() === "") return;
    setTodos([...todos, { id: Date.now(), text: task, completed: false }]);
    setTask("");
  };

  // Toggle completed
  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Delete todo
  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="container" style={{ textAlign: "center", marginTop: "40px" }}>
      <h1 className="h1" >React TODO App </h1>

      <input className="input"
        type="text"
        placeholder="Enter task..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <button className="btn1" onClick={addTodo}>Add</button>

      <ul className="list" style={{ listStyle: "none", padding: 0 }}>
        {todos.map((todo) => (
          <li className="li"
            key={todo.id}
            style={{
              margin: "10px 0",
              textDecoration: todo.completed ? "line-through" : "none",
            }}
          >
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => toggleTodo(todo.id)}
            />
            {todo.text}
            <button className="btn2"
              onClick={() => deleteTodo(todo.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
