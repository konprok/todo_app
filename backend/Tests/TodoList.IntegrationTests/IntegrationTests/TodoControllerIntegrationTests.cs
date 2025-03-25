namespace TodoList.IntegrationTests.IntegrationTests;

public class TodoControllerIntegrationTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;

    public TodoControllerIntegrationTests(CustomWebApplicationFactory factory)
    {
        _client = factory.CreateClient();
    }

    #region CreateTodo Tests

    [Fact]
    public async Task CreateTodo_ValidTodo_ReturnsCreatedTodo()
    {
        var newTodo = new Todo
        {
            Title = "Test Todo",
            Description = "Test Description",
            Priority = TodoPriority.Normal
        };

        var response = await _client.PostAsJsonAsync("/todos", newTodo);

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var createdTodo = await response.Content.ReadFromJsonAsync<TodoEntity>();
        createdTodo.Should().NotBeNull();
        createdTodo.Title.Should().Be(newTodo.Title);
        createdTodo.Description.Should().Be(newTodo.Description);
        createdTodo.Priority.Should().Be(newTodo.Priority);
        createdTodo.IsCompleted.Should().BeFalse();
        createdTodo.IsDeleted.Should().BeFalse();
    }

    [Fact]
    public async Task CreateTodo_NullTitle_ReturnsBadRequest()
    {
        var invalidTodo = new Todo
        {
            Title = null,
            Description = "Some description",
            Priority = TodoPriority.Normal
        };

        var response = await _client.PostAsJsonAsync("/todos", invalidTodo);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task CreateTodo_EmptyTitle_ReturnsBadRequest()
    {
        var invalidTodo = new Todo
        {
            Title = "",
            Description = "Some description",
            Priority = TodoPriority.Normal
        };

        var response = await _client.PostAsJsonAsync("/todos", invalidTodo);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task CreateTodo_InvalidPriority_ReturnsBadRequest()
    {
        var invalidTodo = new Todo
        {
            Title = "Valid Title",
            Description = "Some description",
            Priority = (TodoPriority)999 // Invalid priority
        };

        var response = await _client.PostAsJsonAsync("/todos", invalidTodo);

        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    #endregion

    #region GetTodos Tests

    [Fact]
    public async Task GetTodos_ReturnsListOfTodos()
    {
        var response = await _client.GetAsync("/todos");

        response.StatusCode.Should().Be(HttpStatusCode.OK);
        var todos = await response.Content.ReadFromJsonAsync<List<TodoEntity>>();
        todos.Should().NotBeNull();
    }

    #endregion

    #region GetTodoById Tests

    [Fact]
    public async Task GetTodoById_ExistingTodo_ReturnsTodo()
    {
        var newTodo = new Todo
        {
            Title = "Get By Id Test",
            Description = "Test Description",
            Priority = TodoPriority.High
        };
        var createResponse = await _client.PostAsJsonAsync("/todos", newTodo);
        var createdTodo = await createResponse.Content.ReadFromJsonAsync<TodoEntity>();

        var getResponse = await _client.GetAsync($"/todos/{createdTodo.Id}");

        getResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        var retrievedTodo = await getResponse.Content.ReadFromJsonAsync<TodoEntity>();
        retrievedTodo.Should().NotBeNull();
        retrievedTodo.Id.Should().Be(createdTodo.Id);
    }

    [Fact]
    public async Task GetTodoById_NonExistentTodo_ReturnsNotFound()
    {
        var response = await _client.GetAsync("/todos/99999");

        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    #endregion

    #region UpdateTodo Tests

    [Fact]
    public async Task UpdateTodo_ValidUpdate_ReturnsUpdatedTodo()
    {
        var newTodo = new Todo
        {
            Title = "Update Test",
            Description = "Original Description",
            Priority = TodoPriority.Low
        };
        var createResponse = await _client.PostAsJsonAsync("/todos", newTodo);
        var createdTodo = await createResponse.Content.ReadFromJsonAsync<TodoEntity>();

        var updateTodo = new Todo
        {
            Title = "Updated Title",
            Description = "Updated Description",
            Priority = TodoPriority.High
        };
        var updateResponse = await _client.PatchAsJsonAsync($"/todos/{createdTodo.Id}", updateTodo);

        updateResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        var updatedTodo = await updateResponse.Content.ReadFromJsonAsync<TodoEntity>();
        updatedTodo.Title.Should().Be(updateTodo.Title);
        updatedTodo.Description.Should().Be(updateTodo.Description);
        updatedTodo.Priority.Should().Be(updateTodo.Priority);
    }

    [Fact]
    public async Task UpdateTodo_NonExistentTodo_ReturnsNotFound()
    {
        var updateTodo = new Todo
        {
            Title = "Updated Title",
            Description = "Updated Description",
            Priority = TodoPriority.High
        };

        var updateResponse = await _client.PatchAsJsonAsync("/todos/99999", updateTodo);

        updateResponse.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task UpdateTodo_InvalidTitle_ReturnsBadRequest()
    {
        var newTodo = new Todo
        {
            Title = "Update Test",
            Description = "Original Description",
            Priority = TodoPriority.Low
        };
        var createResponse = await _client.PostAsJsonAsync("/todos", newTodo);
        var createdTodo = await createResponse.Content.ReadFromJsonAsync<TodoEntity>();

        var updateTodo = new Todo
        {
            Title = "",
            Description = "Updated Description",
            Priority = TodoPriority.High
        };
        var updateResponse = await _client.PatchAsJsonAsync($"/todos/{createdTodo.Id}", updateTodo);

        updateResponse.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    #endregion

    #region UpdateTodoStatus Tests

    [Fact]
    public async Task UpdateTodoStatus_ValidStatusChange_ReturnsUpdatedTodo()
    {
        var newTodo = new Todo
        {
            Title = "Status Change Test",
            Description = "Test Description",
            Priority = TodoPriority.Normal
        };
        var createResponse = await _client.PostAsJsonAsync("/todos", newTodo);
        var createdTodo = await createResponse.Content.ReadFromJsonAsync<TodoEntity>();

        var statusChangeResponse = await _client.PatchAsJsonAsync($"/todos/{createdTodo.Id}/status", true);

        statusChangeResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        var updatedTodo = await statusChangeResponse.Content.ReadFromJsonAsync<TodoEntity>();
        updatedTodo.IsCompleted.Should().BeTrue();
    }

    [Fact]
    public async Task UpdateTodoStatus_NonExistentTodo_ReturnsNotFound()
    {
        var statusChangeResponse = await _client.PatchAsJsonAsync("/todos/99999/status", true);

        statusChangeResponse.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    #endregion

    #region DeleteTodo Tests

    [Fact]
    public async Task DeleteTodo_ExistingTodo_ReturnsTrue()
    {
        var newTodo = new Todo
        {
            Title = "Delete Test",
            Description = "Test Description",
            Priority = TodoPriority.High
        };
        var createResponse = await _client.PostAsJsonAsync("/todos", newTodo);
        var createdTodo = await createResponse.Content.ReadFromJsonAsync<TodoEntity>();

        var deleteResponse = await _client.DeleteAsync($"/todos/{createdTodo.Id}");

        deleteResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        var deleteResult = await deleteResponse.Content.ReadFromJsonAsync<bool>();
        deleteResult.Should().BeTrue();
    }

    [Fact]
    public async Task DeleteTodo_NonExistentTodo_ReturnsNotFound()
    {
        var deleteResponse = await _client.DeleteAsync("/todos/99999");

        deleteResponse.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    #endregion
}