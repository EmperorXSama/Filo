using System.Linq.Expressions;
using System.Reflection.Emit;
using Filo.Application.Abstractions.Data;
using Filo.Domain.Common.Contracts;
using Microsoft.EntityFrameworkCore;

namespace Filo.Infrastructure.Database;

public sealed class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options): DbContext(options), IUnitOfWork
{
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema(Schemas.DefaultSchema);
        modelBuilder.ApplyConfigurationsFromAssembly(AssemblyReference.Infrastructure);
        
        
        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            if (!typeof(ISoftDeletable).IsAssignableFrom(entityType.ClrType))
                continue;

            var parameter = Expression.Parameter(entityType.ClrType, "e");
            var property = Expression.Property(parameter, nameof(ISoftDeletable.IsDeleted));
            var filter = Expression.Lambda(Expression.Not(property), parameter);
            
            entityType.SetQueryFilter(filter);
        }
    }
}