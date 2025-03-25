using TodoList.WebApi.Database.Entities;

namespace TodoList.WebApi.Database.Repositories.Interfaces;

public interface ITodoRepository
{
    Task<TodoEntity?> GetTodoById(long id);
    Task<IEnumerable<TodoEntity>> GetTodos();
    Task InsertTodoAsync(TodoEntity todoEntity);
    Task SaveAsync();
}