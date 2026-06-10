using Filo.Domain.Common.Primitives;

namespace Filo.Application.Abstractions.Data;

public interface IRepository<TEntity>
    where TEntity : Entity<Guid>
{
    IQueryable<TEntity> GetAll();
    Task<TEntity?> GetByIdAsync(Guid id, CancellationToken ct = default);
    void Add(TEntity entity);
    void Update(TEntity entity);
    void Remove(TEntity entity);
}
