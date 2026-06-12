namespace Filo.Application.Abstractions.Data;

public interface ICompensationService
{
    void Register(Func<CancellationToken, Task> action);
    Task ExecuteAllAsync(CancellationToken ct = default);
}
