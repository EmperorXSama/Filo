using Filo.Domain.Common.Contracts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace Filo.Infrastructure.Database.Interceptors;

public sealed class AuditableInterceptors :SaveChangesInterceptor
{
    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(DbContextEventData eventData, InterceptionResult<int> result,
        CancellationToken cancellationToken = new CancellationToken())
    {
        if (eventData.Context is null)
        {
            return base.SavingChangesAsync(eventData, result, cancellationToken);
        }
        
        var now = DateTimeOffset.UtcNow;
        foreach (var entity in eventData.Context.ChangeTracker.Entries<IAuditable>())
        {
            if (entity.State == EntityState.Added)
            {
                entity.Property(nameof(IAuditable.CreatedOnUtc)).CurrentValue = now;
            }

            if (entity.State == EntityState.Modified)
            {
                entity.Property(nameof(IAuditable.UpdatedOnUtc)).CurrentValue = now;
            }
            
        }

        return  base.SavingChangesAsync(eventData, result, cancellationToken);
    }
}