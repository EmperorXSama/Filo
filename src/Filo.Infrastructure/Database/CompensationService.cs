using Filo.Application.Abstractions.Data;

namespace Filo.Infrastructure.Database;

internal sealed class CompensationService : ICompensationService
{
    private readonly List<Func<CancellationToken, Task>> _compensations = [];

    public void Register(Func<CancellationToken, Task> action)
    {
        _compensations.Add(action);
    }

    public async Task ExecuteAllAsync(CancellationToken ct = default)
    {
        for (var i = _compensations.Count - 1; i >= 0; i--)
        {
            if (ct.IsCancellationRequested) break;
            await _compensations[i](ct);
        }
    }
}
