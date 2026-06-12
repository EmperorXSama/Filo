namespace Filo.Infrastructure.Session;

public sealed class UserSession
{
    public Guid SessionId { get; init; }
    public Guid UserId { get; init; }
    public string? AccessToken { get; set; }
    public string? RefreshToken { get; set; }
    public DateTimeOffset? TokenExpiresAt { get; set; }
    public string? IpAddress { get; init; }
    public string? UserAgent { get; init; }
    public DateTimeOffset CreatedAt { get; init; }
    public DateTimeOffset ExpiresAt { get; init; }
}
