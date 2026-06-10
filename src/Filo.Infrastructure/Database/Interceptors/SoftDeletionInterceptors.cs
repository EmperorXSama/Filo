using Filo.Domain.Common.Contracts;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace Filo.Infrastructure.Database.Interceptors;

public sealed class SoftDeletionInterceptors: SaveChangesInterceptor
{
    public override ValueTask<InterceptionResult<int>> SavingChangesAsync(DbContextEventData eventData, InterceptionResult<int> result,
        CancellationToken cancellationToken = new CancellationToken())
    {
        if (eventData.Context is null)
            return base.SavingChangesAsync(eventData, result, cancellationToken);

        var now = DateTimeOffset.UtcNow;
        
        foreach (var entry in eventData.Context.ChangeTracker.Entries<ISoftDeletable>())
        {
            if (entry.State != EntityState.Deleted)
                continue;

            entry.State = EntityState.Modified;
            entry.Property(nameof(ISoftDeletable.DeletedOnUtc)).CurrentValue = now;
            entry.Property(nameof(ISoftDeletable.IsDeleted)).CurrentValue = true;
        }
        return base.SavingChangesAsync(eventData, result, cancellationToken);
    }
}