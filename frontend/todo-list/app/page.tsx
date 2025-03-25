"use client";

import { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import {
  getTodos,
  createTodo,
  updateTodo,
  changeTodoStatus,
  deleteTodo,
  TodoEntity,
  TodoPriority,
} from "../services/todoService";

const priorityLabels = {
  [TodoPriority.Low]: "Low",
  [TodoPriority.Normal]: "Normal",
  [TodoPriority.High]: "High",
  [TodoPriority.Critical]: "Critical",
};

const priorityColors = {
  [TodoPriority.Low]: "border-green-500",
  [TodoPriority.Normal]: "border-blue-500",
  [TodoPriority.High]: "border-yellow-500",
  [TodoPriority.Critical]: "border-red-600",
};

const priorityBadgeColors = {
  [TodoPriority.Low]: "bg-green-100 text-green-800",
  [TodoPriority.Normal]: "bg-blue-100 text-blue-800",
  [TodoPriority.High]: "bg-yellow-100 text-yellow-800",
  [TodoPriority.Critical]: "bg-red-100 text-red-800",
};

export default function TodoListPage() {
  const [todos, setTodos] = useState<TodoEntity[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState<TodoPriority>(TodoPriority.Normal);

  const [editTodoId, setEditTodoId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState<TodoPriority>(TodoPriority.Normal);

  useEffect(() => {
    fetchTodos();
  }, []);

  async function fetchTodos() {
    try {
      const data = await getTodos();
      setTodos(data);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Error fetching tasks!',
        background: '#f3f4f6',
        confirmButtonColor: '#3b82f6',
      });
    }
  }

  async function handleAddTask() {
    if (!newTitle.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Input',
        text: 'Please enter a task title!',
        background: '#f3f4f6',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }
    try {
      const created = await createTodo({
        title: newTitle.slice(0, 100),
        description: newDescription.slice(0, 1000),
        priority: newPriority,
      });
      setTodos((prev) => [...prev, created]);
      setNewTitle("");
      setNewDescription("");
      setNewPriority(TodoPriority.Normal);
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to create task!',
        background: '#f3f4f6',
        confirmButtonColor: '#3b82f6',
      });
    }
  }

  function startEditing(todo: TodoEntity) {
    setEditTodoId(todo.id);
    setEditTitle(todo.title);
    setEditDescription(todo.description || "");
    setEditPriority(todo.priority);
  }

  function cancelEditing() {
    setEditTodoId(null);
    setEditTitle("");
    setEditDescription("");
    setEditPriority(TodoPriority.Normal);
  }

  async function confirmEditing(id: number) {
    if (!editTitle.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Invalid Input',
        text: 'Title cannot be empty!',
        background: '#f3f4f6',
        confirmButtonColor: '#3b82f6',
      });
      return;
    }
    try {
      const updated = await updateTodo(id, {
        title: editTitle.slice(0, 100),
        description: editDescription.slice(0, 1000),
        priority: editPriority,
      });
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
      cancelEditing();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to edit task!',
        background: '#f3f4f6',
        confirmButtonColor: '#3b82f6',
      });
    }
  }

  async function handleToggleComplete(todo: TodoEntity) {
    try {
      const updated = await changeTodoStatus(todo.id, !todo.isCompleted);
      setTodos((prev) => prev.map((t) => (t.id === todo.id ? updated : t)));
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to change task status!',
        background: '#f3f4f6',
        confirmButtonColor: '#3b82f6',
      });
    }
  }

  async function handleDelete(id: number) {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      background: '#f3f4f6',
    });

    if (result.isConfirmed) {
      try {
        await deleteTodo(id);
        setTodos((prev) => prev.filter((t) => t.id !== id));
        Swal.fire({
          title: 'Deleted!',
          text: 'Your task has been deleted.',
          icon: 'success',
          background: '#f3f4f6',
          confirmButtonColor: '#3b82f6',
        });
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete task!',
          background: '#f3f4f6',
          confirmButtonColor: '#3b82f6',
        });
      }
    }
  }

  const incompleteTodos = todos.filter(todo => !todo.isCompleted)
    .sort((a, b) => b.priority - a.priority);
  const completedTodos = todos.filter(todo => todo.isCompleted)
    .sort((a, b) => b.priority - a.priority);

  return (
    <div className="max-w-2xl mx-auto p-6 mt-8 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-xl rounded-2xl p-8 mb-8">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">My Todo List</h1>

        <div className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Task Title</span>
            </label>
            <input
              type="text"
              placeholder="Enter title..."
              className="input input-bordered w-full border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              value={newTitle}
              maxLength={100}
              onChange={(e) => setNewTitle(e.target.value)}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Description</span>
            </label>
            <textarea
              className="textarea textarea-bordered w-full border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="Enter description..."
              rows={4}
              maxLength={1000}
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Priority</span>
            </label>
            <select
              className="select select-bordered w-full border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              value={newPriority}
              onChange={(e) => setNewPriority(parseInt(e.target.value) as TodoPriority)}
            >
              <option value={TodoPriority.Low}>🟢 Low</option>
              <option value={TodoPriority.Normal}>🔵 Normal</option>
              <option value={TodoPriority.High}>🟠 High</option>
              <option value={TodoPriority.Critical}>🔴 Critical</option>
            </select>
          </div>

          <button 
            className="btn btn-primary w-full mt-4 rounded-xl border-2 border-blue-600 hover:bg-blue-600 transition-all duration-300 ease-in-out transform hover:scale-[1.02]"
            onClick={handleAddTask}
          >
            ➕ Add Task
          </button>
        </div>
      </div>

      <div className="space-y-6">
        {incompleteTodos.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-700">Active Tasks</h2>
            <div className="space-y-4">
              {incompleteTodos.map((todo) => (
                <div
                  key={todo.id}
                  className={`bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-[1.02] border-l-4 ${priorityColors[todo.priority]}`}
                >
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="relative w-7 h-7 mt-1">
                        <input
                          type="checkbox"
                          className="absolute opacity-0 w-full h-full cursor-pointer z-10 peer"
                          checked={todo.isCompleted}
                          onChange={() => handleToggleComplete(todo)}
                        />
                        <div className={`absolute inset-0 border-2 ${todo.isCompleted ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-300'} rounded-lg transition-all duration-300`}>
                          {todo.isCompleted && (
                            <svg 
                              xmlns="http://www.w3.org/2000/svg" 
                              className="h-full w-full text-white p-1" 
                              fill="none" 
                              viewBox="0 0 24 24" 
                              stroke="currentColor"
                            >
                              <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={3} 
                                d="M5 13l4 4L19 7" 
                              />
                            </svg>
                          )}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        {editTodoId === todo.id ? (
                          <div className="space-y-3">
                            <input
                              type="text"
                              className="input input-bordered w-full rounded-xl"
                              value={editTitle}
                              maxLength={100}
                              onChange={(e) => setEditTitle(e.target.value)}
                            />
                            <textarea
                              className="textarea textarea-bordered w-full rounded-xl"
                              rows={4}
                              maxLength={1000}
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                            />
                            <select
                              className="select select-bordered w-full rounded-xl"
                              value={editPriority}
                              onChange={(e) =>
                                setEditPriority(parseInt(e.target.value) as TodoPriority)
                              }
                            >
                              <option value={TodoPriority.Low}>🟢 Low</option>
                              <option value={TodoPriority.Normal}>🔵 Normal</option>
                              <option value={TodoPriority.High}>🟠 High</option>
                              <option value={TodoPriority.Critical}>🔴 Critical</option>
                            </select>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <h3 className="text-lg font-bold text-gray-800 break-words">
                              {todo.title}
                            </h3>
                            {todo.description && (
                              <p className="text-sm text-gray-600 break-words max-h-24 overflow-auto">
                                {todo.description}
                              </p>
                            )}
                            <div className="flex items-center">
                              <span className="text-sm font-semibold mr-2 text-gray-700">Priority:</span>
                              <span className={`px-2 py-1 rounded-full text-xs font-bold ${priorityBadgeColors[todo.priority]}`}>
                                {priorityLabels[todo.priority]}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col space-y-2 w-24">
                        {editTodoId === todo.id ? (
                          <>
                            <button 
                              className="btn btn-success btn-sm rounded-xl border-2 border-green-600 hover:bg-green-600 transition-all duration-300 ease-in-out transform hover:scale-[1.05] w-full"
                              onClick={() => confirmEditing(todo.id)}
                            >
                              Save
                            </button>
                            <button 
                              className="btn btn-ghost btn-sm rounded-xl border-2 border-gray-300 hover:bg-gray-100 transition-all duration-300 ease-in-out transform hover:scale-[1.05] w-full"
                              onClick={cancelEditing}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              className="btn btn-secondary btn-sm rounded-xl border-2 border-yellow-600 hover:bg-yellow-600 transition-all duration-300 ease-in-out transform hover:scale-[1.05] w-full"
                              onClick={() => startEditing(todo)}
                            >
                              Edit
                            </button>
                            <button 
                              className="btn btn-error btn-sm rounded-xl border-2 border-red-600 hover:bg-red-600 transition-all duration-300 ease-in-out transform hover:scale-[1.05] w-full"
                              onClick={() => handleDelete(todo.id)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {completedTodos.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-700">Completed Tasks</h2>
            <div className="space-y-4">
              {completedTodos.map((todo) => (
                <div
                  key={todo.id}
                  className={`bg-gray-100 rounded-2xl shadow-md border-l-4 ${priorityColors[todo.priority]} opacity-70`}
                >
                  <div className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="relative w-7 h-7 mt-1">
                        <input
                          type="checkbox"
                          className="absolute opacity-0 w-full h-full cursor-pointer z-10 peer"
                          checked={todo.isCompleted}
                          onChange={() => handleToggleComplete(todo)}
                        />
                        <div className="absolute inset-0 bg-blue-500 border-2 border-blue-500 rounded-lg">
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-full w-full text-white p-1" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path 
                              strokeLinecap="round" 
                              strokeLinejoin="round" 
                              strokeWidth={3} 
                              d="M5 13l4 4L19 7" 
                            />
                          </svg>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-400 line-through break-words">
                          {todo.title}
                        </h3>
                        {todo.description && (
                          <p className="text-sm text-gray-400 line-through break-words max-h-24 overflow-auto mt-1">
                            {todo.description}
                          </p>
                        )}
                        <div className="mt-2 flex items-center">
                          <span className="text-sm font-semibold mr-2 text-gray-500">Priority:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${priorityBadgeColors[todo.priority]} opacity-70`}>
                            {priorityLabels[todo.priority]}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}