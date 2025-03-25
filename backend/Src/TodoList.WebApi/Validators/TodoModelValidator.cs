using FluentValidation;
using TodoList.WebApi.Models;

namespace TodoList.WebApi.Validators;

public class TodoModelValidator : AbstractValidator<Todo>
{
    public TodoModelValidator()
    {
        RuleFor(x => x.Title).NotEmpty().MinimumLength(3).MaximumLength(100);
        RuleFor(x => x.Description).NotEmpty().MaximumLength(1000);
        RuleFor(x => x.Priority)
            .IsInEnum()
            .WithMessage("Priority must be one of: Low, Normal, High, or Critical.");

    }
}