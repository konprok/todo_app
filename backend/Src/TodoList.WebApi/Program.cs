using FluentValidation;
using Microsoft.EntityFrameworkCore;
using TodoList.WebApi.Database.DbContext;
using TodoList.WebApi.Database.Repositories;
using TodoList.WebApi.Database.Repositories.Interfaces;
using TodoList.WebApi.Models;
using TodoList.WebApi.Services;
using TodoList.WebApi.Services.Interfaces;
using TodoList.WebApi.Validators;

var builder = WebApplication.CreateBuilder(args);

var configuration = builder.Configuration;

builder.Services.AddScoped<ITodoService, TodoService>();
builder.Services.AddScoped<ITodoRepository, TodoRepository>();
builder.Services.AddScoped<IValidator<Todo>, TodoModelValidator>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalFrontend3000", policy =>
    {
        policy.WithOrigins("http://localhost:3000")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services.AddControllers().AddNewtonsoftJson(options =>
    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(configuration.GetConnectionString("AppDbContext"));
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowLocalFrontend3000");
//app.UseAuthorization();

app.MapControllers();

app.Run();

public partial class Program
{
}