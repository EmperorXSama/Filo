using System.Collections.Concurrent;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;

namespace Filo.Infrastructure.Session;

internal sealed class InMemoryTicketStore : ITicketStore
{
    private readonly ConcurrentDictionary<string, AuthenticationTicket> _tickets = new();

    public Task<string> StoreAsync(AuthenticationTicket ticket)
    {
        var key = Guid.NewGuid().ToString("N");
        _tickets.TryAdd(key, ticket);
        return Task.FromResult(key);
    }

    public Task RenewAsync(string key, AuthenticationTicket ticket)
    {
        _tickets.TryUpdate(key, ticket, _tickets[key]);
        return Task.CompletedTask;
    }

    public Task<AuthenticationTicket?> RetrieveAsync(string key)
    {
        _tickets.TryGetValue(key, out var ticket);
        return Task.FromResult<AuthenticationTicket?>(ticket);
    }

    public Task RemoveAsync(string key)
    {
        _tickets.TryRemove(key, out _);
        return Task.CompletedTask;
    }
}
