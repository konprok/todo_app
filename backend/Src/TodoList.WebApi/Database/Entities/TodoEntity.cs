using TodoList.WebApi.Models;

namespace TodoList.WebApi.Database.Entities;

public sealed class TodoEntity
{
    public long Id { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public bool IsCompleted { get; set; }
    public bool IsDeleted { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset LastModified { get; set; }
    public TodoPriority Priority { get; set; }

    public TodoEntity(Todo todo)
    {
        Title = todo.Title;
        Description = Description;
        IsCompleted = false;
        IsDeleted = false;
        CreatedAt = DateTimeOffset.UtcNow;
        LastModified = DateTimeOffset.UtcNow;
        Priority = todo.Priority;
    }
}

public enum TodoPriority
{
    Low = 1,
    Normal = 2,
    High = 3,
    Critical = 4
}