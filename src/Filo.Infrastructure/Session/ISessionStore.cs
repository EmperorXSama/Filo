namespace Filo.Infrastructure.Session;

public interface ISessionStore
{
    Task<UserSession> CreateSessionAsync(UserSession session, CancellationToken ct = default);
    Task<UserSession?> GetSessionAsync(Guid sessionId, CancellationToken ct = default);
    Task UpdateSessionTokensAsync(Guid sessionId, string accessToken, string refreshToken, DateTimeOffset expiresAt, CancellationToken ct = default);
    Task RevokeSessionAsync(Guid sessionId, CancellationToken ct = default);
    Task RevokeAllUserSessionsAsync(Guid userId, CancellationToken ct = default);
    Task<IReadOnlyList<UserSession>> GetUserSessionsAsync(Guid userId, CancellationToken ct = default);
}
