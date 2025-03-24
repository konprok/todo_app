export enum TodoPriority {
  Low = 1,
  Normal = 2,
  High = 3,
  Critical = 4,
}

export interface TodoEntity {
  id: number;
  title: string;
  description: string | null;
  isCompleted: boolean;
  isDeleted: boolean;
  createdAt: string;
  lastModified: string;
  priority: TodoPriority;
}

export interface CreateOrUpdateTodo {
  title: string;
  description?: string;
  priority: TodoPriority;
}

const BASE_URL = "http://localhost:5020/todos";

export async function getTodos(): Promise<TodoEntity[]> {
  const response = await fetch(BASE_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch todos");
  }
  return response.json();
}

export async function createTodo(todoData: CreateOrUpdateTodo): Promise<TodoEntity> {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todoData),
  });
  if (!response.ok) {
    throw new Error("Failed to create todo");
  }
  return response.json();
}

export async function updateTodo(id: number, todoData: CreateOrUpdateTodo): Promise<TodoEntity> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(todoData),
  });
  if (!response.ok) {
    throw new Error("Failed to update todo");
  }
  return response.json();
}

export async function changeTodoStatus(id: number, isCompleted: boolean): Promise<TodoEntity> {
  const response = await fetch(`${BASE_URL}/${id}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(isCompleted),
  });
  if (!response.ok) {
    throw new Error("Failed to change todo status");
  }
  return response.json();
}

export async function deleteTodo(id: number): Promise<boolean> {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete todo");
  }
  return response.json();
}
