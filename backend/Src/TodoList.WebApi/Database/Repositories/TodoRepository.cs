using Microsoft.EntityFrameworkCore;
using TodoList.WebApi.Database.DbContext;
using TodoList.WebApi.Database.Entities;
using TodoList.WebApi.Database.Repositories.Interfaces;

namespace TodoList.WebApi.Database.Repositories;

public class TodoRepository : ITodoRepository
{
    private readonly AppDbContext _dbContext;

    public TodoRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public async Task<TodoEntity?> GetTodoById(long id)
    {
        TodoEntity? todoEntity = await _dbContext.Todos.FirstOrDefaultAsync(x => x.Id == id);
        return todoEntity;
    }

    public async Task<IEnumerable<TodoEntity>> GetTodos()
    {
        var todos = await _dbContext.Todos.Where(x => x.IsDeleted == false).ToListAsync();
        return todos;
    }

    public async Task InsertTodoAsync(TodoEntity todoEntity)
    {
        await _dbContext.Todos.AddAsync(todoEntity);
    }

    public async Task SaveAsync()
    {
        await _dbContext.SaveChangesAsync();
    }
}