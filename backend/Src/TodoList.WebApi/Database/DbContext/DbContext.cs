using Microsoft.EntityFrameworkCore;
using TodoList.WebApi.Database.Configuration;
using TodoList.WebApi.Database.Entities;

namespace TodoList.WebApi.Database.DbContext;

public class AppDbContext : Microsoft.EntityFrameworkCore.DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
        
    }

    public DbSet<TodoEntity> Todos { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfiguration(new TodoEntityConfiguration());
    }
}