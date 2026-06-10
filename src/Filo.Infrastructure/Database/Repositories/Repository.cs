using Filo.Application.Abstractions.Data;
using Filo.Domain.Common.Primitives;
using Microsoft.EntityFrameworkCore;

namespace Filo.Infrastructure.Database.Repositories;

internal sealed class Repository<TEntity>(ApplicationDbContext context) : IRepository<TEntity>
    where TEntity : Entity<Guid>
{
    public IQueryable<TEntity> GetAll() => context.Set<TEntity>().AsQueryable();

    public async Task<TEntity?> GetByIdAsync(Guid id, CancellationToken ct = default)
        => await context.Set<TEntity>().FirstOrDefaultAsync(e => e.Id == id, ct);

    public void Add(TEntity entity) => context.Set<TEntity>().Add(entity);

    public void Update(TEntity entity) => context.Set<TEntity>().Update(entity);

    public void Remove(TEntity entity) => context.Set<TEntity>().Remove(entity);
}
