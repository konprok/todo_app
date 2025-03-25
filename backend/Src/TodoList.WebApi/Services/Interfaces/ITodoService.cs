using Microsoft.AspNetCore.Mvc;
using TodoList.WebApi.Database.Entities;
using TodoList.WebApi.Models;

namespace TodoList.WebApi.Services.Interfaces;

public interface ITodoService
{
    public Task<TodoEntity> CreateTodo(Todo todo);
    public Task<IEnumerable<TodoEntity>> GetTodos();
    public Task<TodoEntity> GetTodoById(long id);
    public Task<TodoEntity> UpdateTodo(long id, Todo todo);
    public Task<TodoEntity> ChangeTodoStatus(long id, bool finished);
    public Task<bool> DeleteTodo(long id);
}