namespace TodoList.WebApi.Models.Exceptions;

public sealed class InvalidArgumentException : Exception
{
    public InvalidArgumentException(string? message)
        : base(message)
    {
    }
}