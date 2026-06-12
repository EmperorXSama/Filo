namespace Filo.Application.Abstractions.Data;

public interface IUnitOfWork
{
    Task<int> SaveChangesAsync(CancellationToken ct = default);
    Task RollbackAsync(CancellationToken ct = default);
}