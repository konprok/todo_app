"use client";

import { useEffect, useState } from "react";
import {
  getTodos,
  createTodo,
  updateTodo,
  changeTodoStatus,
  deleteTodo,
  TodoEntity,
  TodoPriority,
} from "../services/todoService";

export default function Home() {
  const [todos, setTodos] = useState<TodoEntity[]>([]);

  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [newTodoDescription, setNewTodoDescription] = useState("");
  const [newTodoPriority, setNewTodoPriority] = useState<TodoPriority>(TodoPriority.Normal);

  const [editTodoId, setEditTodoId] = useState<number | null>(null);
  const [editTodoTitle, setEditTodoTitle] = useState("");
  const [editTodoDescription, setEditTodoDescription] = useState("");
  const [editTodoPriority, setEditTodoPriority] = useState<TodoPriority>(TodoPriority.Normal);

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    try {
      const data = await getTodos();
      setTodos(data);
    } catch (error) {
      console.error(error);
      alert("Błąd podczas pobierania listy zadań!");
    }
  }

  async function handleAddTodo() {
    if (!newTodoTitle.trim()) {
      alert("Podaj tytuł zadania!");
      return;
    }
    try {
      const created = await createTodo({
        title: newTodoTitle,
        description: newTodoDescription,
        priority: newTodoPriority,
      });

      setTodos([...todos, created]);
      setNewTodoTitle("");
      setNewTodoDescription("");
      setNewTodoPriority(TodoPriority.Normal);
    } catch (error) {
      console.error(error);
      alert("Błąd podczas tworzenia zadania!");
    }
  }

  function startEditing(todo: TodoEntity) {
    setEditTodoId(todo.id);
    setEditTodoTitle(todo.title);
    setEditTodoDescription(todo.description || "");
    setEditTodoPriority(todo.priority);
  }

  function cancelEditing() {
    setEditTodoId(null);
    setEditTodoTitle("");
    setEditTodoDescription("");
    setEditTodoPriority(TodoPriority.Normal);
  }

  async function confirmEditing(id: number) {
    if (!editTodoTitle.trim()) {
      alert("Tytuł nie może być pusty!");
      return;
    }
    try {
      const updated = await updateTodo(id, {
        title: editTodoTitle,
        description: editTodoDescription,
        priority: editTodoPriority,
      });

      setTodos(todos.map((t) => (t.id === id ? updated : t)));
      cancelEditing();
    } catch (error) {
      console.error(error);
      alert("Błąd podczas edycji zadania!");
    }
  }

  async function handleToggleComplete(todo: TodoEntity) {
    try {
      const updated = await changeTodoStatus(todo.id, !todo.isCompleted);
      setTodos(todos.map((t) => (t.id === todo.id ? updated : t)));
    } catch (error) {
      console.error(error);
      alert("Błąd podczas zmiany statusu zadania!");
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Czy na pewno chcesz usunąć to zadanie?")) return;
    try {
      await deleteTodo(id);
      setTodos(todos.filter((t) => t.id !== id));
    } catch (error) {
      console.error(error);
      alert("Błąd podczas usuwania zadania!");
    }
  }

  return (
    <div className="container">
      <h1 className="todoHeader">Moja lista ToDo</h1>
      <div style={{ marginBottom: "16px" }}>
        <input
          className="todoInput"
          type="text"
          placeholder="Tytuł zadania..."
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
        />
        <textarea
          className="todoInput"
          placeholder="Opis (opcjonalny)"
          value={newTodoDescription}
          onChange={(e) => setNewTodoDescription(e.target.value)}
          style={{ display: "block", marginTop: "8px" }}
        />
        <label style={{ display: "block", margin: "8px 0 4px" }}>Priorytet:</label>
        <select
          value={newTodoPriority}
          onChange={(e) =>
            setNewTodoPriority(parseInt(e.target.value) as TodoPriority)
          }
        >
          <option value={TodoPriority.Low}>Low</option>
          <option value={TodoPriority.Normal}>Normal</option>
          <option value={TodoPriority.High}>High</option>
          <option value={TodoPriority.Critical}>Critical</option>
        </select>

        <button
          className="btnPrimary"
          style={{ display: "block", marginTop: "12px" }}
          onClick={handleAddTodo}
        >
          Dodaj
        </button>
      </div>

      <div>
        {todos.map((todo) => (
          <div className="todoItem" key={todo.id}>
            <input
              type="checkbox"
              className="todoCheckbox"
              checked={todo.isCompleted}
              onChange={() => handleToggleComplete(todo)}
            />

            {editTodoId === todo.id ? (
              <div style={{ flex: 1 }}>
                <input
                  className="todoText"
                  type="text"
                  value={editTodoTitle}
                  onChange={(e) => setEditTodoTitle(e.target.value)}
                />
                <textarea
                  style={{ width: "100%", marginTop: "6px" }}
                  value={editTodoDescription}
                  onChange={(e) => setEditTodoDescription(e.target.value)}
                />
                <label style={{ display: "block", margin: "4px 0" }}>
                  Priorytet:
                </label>
                <select
                  value={editTodoPriority}
                  onChange={(e) =>
                    setEditTodoPriority(parseInt(e.target.value) as TodoPriority)
                  }
                >
                  <option value={TodoPriority.Low}>Low</option>
                  <option value={TodoPriority.Normal}>Normal</option>
                  <option value={TodoPriority.High}>High</option>
                  <option value={TodoPriority.Critical}>Critical</option>
                </select>
              </div>
            ) : (
              <div style={{ flex: 1 }}>
                <span
                  className="todoText"
                  style={{
                    textDecoration: todo.isCompleted ? "line-through" : "none",
                    color: todo.isCompleted ? "#777" : "inherit",
                  }}
                >
                  {todo.title}
                </span>
                {todo.description && (
                  <div style={{ fontSize: "0.9em", color: "#555", marginTop: "4px" }}>
                    Opis: {todo.description}
                  </div>
                )}
                <div style={{ fontSize: "0.9em", marginTop: "2px" }}>
                  Priorytet: {TodoPriority[todo.priority]}
                </div>
              </div>
            )}

            <div className="todoButtons">
              {editTodoId === todo.id ? (
                <>
                  <button
                    className="btnPrimary"
                    onClick={() => confirmEditing(todo.id)}
                  >
                    Zapisz
                  </button>
                  <button className="btnSecondary" onClick={cancelEditing}>
                    Anuluj
                  </button>
                </>
              ) : (
                <button className="btnSecondary" onClick={() => startEditing(todo)}>
                  Edytuj
                </button>
              )}
              <button
                className="btnSecondary"
                onClick={() => handleDelete(todo.id)}
              >
                Usuń
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
