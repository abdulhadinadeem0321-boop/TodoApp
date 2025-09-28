import React, { useState, useEffect } from "react";

export default function TodoApp() {
  
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem("todos_v1");
    return saved ? JSON.parse(saved) : [];
  });
  const [text, setText] = useState("");
  const [filter, setFilter] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  
  useEffect(() => {
    localStorage.setItem("todos_v1", JSON.stringify(todos));
  }, [todos]);

  
  const addTodo = () => {
    if (!text.trim()) return;
    setTodos([...todos, { id: Date.now(), text: text.trim(), completed: false }]);
    setText("");
  };

  
  const toggleTodo = (id) =>
    setTodos(
      todos.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      )
    );

  
  const deleteTodo = (id) =>
    setTodos(todos.filter((t) => t.id !== id));

  
  const clearCompleted = () =>
    setTodos(todos.filter((t) => !t.completed));


  const clearAll = () => {
    if (window.confirm("Delete all todos?")) setTodos([]);
  };

  
  const startEdit = (id, text) => {
    setEditingId(id);
    setEditingText(text);
  };

  
  const saveEdit = (id) => {
    if (!editingText.trim()) {
      cancelEdit();
      return;
    }
    setTodos(
      todos.map((t) =>
        t.id === id ? { ...t, text: editingText.trim() } : t
      )
    );
    setEditingId(null);
    setEditingText("");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingText("");
  };

  const visible = todos.filter((t) => {
    if (filter === "pending") return !t.completed;
    if (filter === "completed") return t.completed;
    return true; // all
  });


  const counts = {
    total: todos.length,
    pending: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length,
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <h2 className="logo"> TODO_______________.__________________.___________________.______ App</h2>
        <div className="nav-buttons">
          <button onClick={() => setFilter("all")}>
            All ({counts.total})
          </button>
          <button onClick={() => setFilter("pending")}>
            Pending ({counts.pending})
          </button>
          <button onClick={() => setFilter("completed")}>
            Completed ({counts.completed})
          </button>
        </div>
      </nav>

      
      <div className="todo-app">
        <div className="input-row">
          <input className="todo-input"
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTodo()}
            placeholder="Enter a task..."
          />
          <button  className="btn" onClick={addTodo}>Add</button>
        </div>

        <ul className="todo-list">
          {visible.map((t) => (
            <li key={t.id} className={t.completed ? "done" : ""}>
              {editingId === t.id ? (
                <input
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") saveEdit(t.id);
                    if (e.key === "Escape") cancelEdit();
                  }}
                  onBlur={() => saveEdit(t.id)}
                  autoFocus
                />
              ) : (
                <>
                  <input 
                    className="checkbox"
                    type="checkbox"
                    checked={t.completed}
                    onChange={() => toggleTodo(t.id)}
                  />
                  <span onDoubleClick={() => startEdit(t.id, t.text)}>
                    {t.text}
                  </span>
                  <button onClick={() => startEdit(t.id, t.text)}>Edit</button>
                  <button onClick={() => deleteTodo(t.id)}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>

        <div className="clear-buttons">
          <button className="clear-btn" onClick={clearCompleted}>Clear Completed</button>
          <button className="clear-btn" onClick={clearAll}>Clear All</button>
        </div>
      </div>
    </div>
  );
}
