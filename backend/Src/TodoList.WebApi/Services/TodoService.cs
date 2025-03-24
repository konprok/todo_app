using FluentValidation;
using TodoList.WebApi.Database.Entities;
using TodoList.WebApi.Database.Repositories.Interfaces;
using TodoList.WebApi.Models;
using TodoList.WebApi.Models.Exceptions;
using TodoList.WebApi.Services.Interfaces;

namespace TodoList.WebApi.Services;

public class TodoService : ITodoService
{
    private readonly ITodoRepository _todoRepository;
    private readonly IValidator<Todo> _todoModelValidator;

    public TodoService(ITodoRepository todoRepository, IValidator<Todo> todoModelValidator)
    {
        _todoRepository = todoRepository;
        _todoModelValidator = todoModelValidator;
    }

    public async Task<TodoEntity> CreateTodo(Todo todo)
    {
        TodoEntity todoEntity = new TodoEntity(todo);
        var validationResult = await _todoModelValidator.ValidateAsync(todo);
        if (!validationResult.IsValid)
        {
            var errors = string.Join("; ", validationResult.Errors.Select(e => e.ErrorMessage));
            throw new InvalidArgumentException(errors);
        }

        await _todoRepository.InsertTodoAsync(todoEntity);
        await _todoRepository.SaveAsync();
        return todoEntity;
    }

    public async Task<IEnumerable<TodoEntity>> GetTodos()
    {
        return await _todoRepository.GetTodos();
    }

    public async Task<TodoEntity> GetTodoById(long id)
    {
        TodoEntity? todoEntity = await _todoRepository.GetTodoById(id);

        if (todoEntity == null)
        {
            throw new NotFoundException(ErrorMessages.NotFound);
        }

        return todoEntity;
    }

    public async Task<TodoEntity> UpdateTodo(long id, Todo todo)
    {
        TodoEntity todoEntity = await GetTodoById(id);
        if (todoEntity.IsDeleted)
        {
            throw new NotFoundException(ErrorMessages.NotExist);
        }
        var validationResult = await _todoModelValidator.ValidateAsync(todo);
        if (!validationResult.IsValid)
        {
            var errors = string.Join("; ", validationResult.Errors.Select(e => e.ErrorMessage));
            throw new InvalidArgumentException(errors);
        }

        todoEntity.Description = todo.Description;
        todoEntity.Title = todo.Title;
        todoEntity.Priority = todo.Priority;
        todoEntity.LastModified = DateTimeOffset.UtcNow;

        await _todoRepository.SaveAsync();

        return todoEntity;
    }

    public async Task<bool> DeleteTodo(long id)
    {
        TodoEntity todoEntity = await GetTodoById(id);

        todoEntity.IsDeleted = true;

        await _todoRepository.SaveAsync();
        return true;
    }
}