using System.Linq.Expressions;
using Filo.Application.Abstractions.Data;
using Filo.Domain.Common.Contracts;
using Filo.Domain.Common.Primitives;
using Filo.Domain.Entities;
using Filo.Domain.Users;
using Microsoft.EntityFrameworkCore;

namespace Filo.Infrastructure.Database;

public sealed class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options): DbContext(options), IUnitOfWork
{
    public DbSet<DummyItem> DummyItems => Set<DummyItem>();
    public DbSet<User> Users => Set<User>();

    public Task RollbackAsync(CancellationToken ct = default)
    {
        ChangeTracker.Clear();
        return Task.CompletedTask;
    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.HasDefaultSchema(Schemas.DefaultSchema);
        modelBuilder.Ignore<DomainEvents>();
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