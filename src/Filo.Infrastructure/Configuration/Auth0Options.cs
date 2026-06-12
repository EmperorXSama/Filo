namespace Filo.Infrastructure.Configuration;

public sealed class Auth0Options
{
    public const string SectionName = "Auth0";

    public string Domain { get; init; } = string.Empty;
    public string ManagementClientId { get; init; } = string.Empty;
    public string ManagementClientSecret { get; init; } = string.Empty;
    public string BffClientId { get; init; } = string.Empty;
    public string BffClientSecret { get; init; } = string.Empty;
    public string Audience { get; init; } = string.Empty;
}
