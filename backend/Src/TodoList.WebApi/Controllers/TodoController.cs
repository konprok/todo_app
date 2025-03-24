using Microsoft.AspNetCore.Mvc;
using TodoList.WebApi.Database.Entities;
using TodoList.WebApi.Models;
using TodoList.WebApi.Models.Exceptions;
using TodoList.WebApi.Services.Interfaces;

namespace TodoList.WebApi.Controllers;

[ApiController]
[Route("todos")]
public class TodoController : ControllerBase
{
    private readonly ITodoService _todoService;

    public TodoController(ITodoService todoService)
    {
        _todoService = todoService;
    }

    /// <summary>
    /// Creates new Todo
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<TodoEntity>> CreateTodo([FromBody] Todo todo)
    {
        try
        {
            return Ok(await _todoService.CreateTodo(todo));
        }
        catch (InvalidArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    /// <summary>
    /// Get list of todos
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TodoEntity>>> GetTodos()
    {
        try
        {
            return Ok(await _todoService.GetTodos());
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    /// <summary>
    /// Gets todo by id
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<TodoEntity>> GetTodoById(long id)
    {
        try
        {
            return Ok(await _todoService.GetTodoById(id));
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    /// <summary>
    /// Updates todos
    /// </summary>
    [HttpPatch("{id}")]
    public async Task<ActionResult<TodoEntity>> PatchTodo(long id, [FromBody] Todo todo)
    {
        try
        {
            return Ok(await _todoService.UpdateTodo(id, todo));
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (InvalidArgumentException ex)
        {
            return BadRequest(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    /// <summary>
    /// Removes todo
    /// </summary>
    [HttpDelete("{id}")]
    public async Task<ActionResult<bool>> DeleteTodo(long id)
    {
        try
        {
            return Ok(await _todoService.DeleteTodo(id));
        }
        catch (NotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }
}