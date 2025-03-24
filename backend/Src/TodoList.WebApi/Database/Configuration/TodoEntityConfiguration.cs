using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TodoList.WebApi.Database.Entities;

namespace TodoList.WebApi.Database.Configuration;

public sealed class TodoEntityConfiguration : IEntityTypeConfiguration<TodoEntity>
{
    public void Configure(EntityTypeBuilder<TodoEntity> builder)
    {
        builder.ToTable("todo_entity");

        builder.HasKey(x => x.Id)
            .HasName("PK_user_entity");

        builder.Property(x => x.Title).IsRequired()
            .HasMaxLength(100)
            .HasColumnName("todo_title");
        
        builder.Property(x => x.Description)
            .HasMaxLength(500)
            .HasColumnName("todo_description");

        builder.Property(x => x.IsCompleted)
            .HasColumnName("is_completed");
        
        builder.Property(x => x.IsDeleted)
            .HasColumnName("is_completed");
        
        builder.Property(x => x.CreatedAt)
            .HasColumnName("created_at");
        
        builder.Property(x => x.LastModified)
            .HasColumnName("updated_at");
        
        builder.Property(x => x.Priority)
            .HasColumnName("priority")
            .HasConversion<int>();
    }
}