using System.Collections.Concurrent;

namespace Filo.Infrastructure.Session;

internal sealed class InMemorySessionStore : ISessionStore
{
    private readonly ConcurrentDictionary<Guid, UserSession> _sessions = new();

    public Task<UserSession> CreateSessionAsync(UserSession session, CancellationToken ct = default)
    {
        _sessions.TryAdd(session.SessionId, session);
        return Task.FromResult(session);
    }

    public Task<UserSession?> GetSessionAsync(Guid sessionId, CancellationToken ct = default)
    {
        _sessions.TryGetValue(sessionId, out var session);
        return Task.FromResult(session);
    }

    public Task UpdateSessionTokensAsync(Guid sessionId, string accessToken, string refreshToken, DateTimeOffset expiresAt, CancellationToken ct = default)
    {
        if (_sessions.TryGetValue(sessionId, out var session))
        {
            session.AccessToken = accessToken;
            session.RefreshToken = refreshToken;
            session.TokenExpiresAt = expiresAt;
        }

        return Task.CompletedTask;
    }

    public Task RevokeSessionAsync(Guid sessionId, CancellationToken ct = default)
    {
        _sessions.TryRemove(sessionId, out _);
        return Task.CompletedTask;
    }

    public Task RevokeAllUserSessionsAsync(Guid userId, CancellationToken ct = default)
    {
        var toRemove = _sessions.Values
            .Where(s => s.UserId == userId)
            .Select(s => s.SessionId)
            .ToList();

        foreach (var sessionId in toRemove)
        {
            _sessions.TryRemove(sessionId, out _);
        }

        return Task.CompletedTask;
    }

    public Task<IReadOnlyList<UserSession>> GetUserSessionsAsync(Guid userId, CancellationToken ct = default)
    {
        var sessions = _sessions.Values
            .Where(s => s.UserId == userId)
            .ToList()
            .AsReadOnly();

        return Task.FromResult<IReadOnlyList<UserSession>>(sessions);
    }
}
