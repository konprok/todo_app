using TodoList.WebApi.Database.Entities;

namespace TodoList.WebApi.Models;

public class Todo
{
    public string? Title { get; set; }
    public string? Description { get; set; }
    public TodoPriority Priority { get; set; }
}
