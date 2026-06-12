using System.Net.Http.Json;
using System.Text.Json.Serialization;
using Filo.Infrastructure.Configuration;
using Microsoft.Extensions.Options;

namespace Filo.Infrastructure.Common.Authentication;

internal sealed class Auth0TokenRefresher
{
    private readonly HttpClient _httpClient;
    private readonly Auth0Options _options;

    public Auth0TokenRefresher(HttpClient httpClient, IOptions<Auth0Options> options)
    {
        _httpClient = httpClient;
        _options = options.Value;
    }

    public async Task<(string AccessToken, string RefreshToken, DateTimeOffset ExpiresAt)> RefreshAsync(string refreshToken)
    {
        var formData = new Dictionary<string, string>
        {
            ["client_id"] = _options.BffClientId,
            ["client_secret"] = _options.BffClientSecret,
            ["refresh_token"] = refreshToken,
            ["grant_type"] = "refresh_token"
        };

        var request = new HttpRequestMessage(HttpMethod.Post, $"https://{_options.Domain}/oauth/token")
        {
            Content = new FormUrlEncodedContent(formData)
        };

        var response = await _httpClient.SendAsync(request);
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<TokenRefreshResponse>()
            ?? throw new InvalidOperationException("Token refresh returned null.");

        return (result.AccessToken, result.RefreshToken ?? refreshToken, DateTimeOffset.UtcNow.AddSeconds(result.ExpiresIn));
    }

    private sealed record TokenRefreshResponse
    {
        [JsonPropertyName("access_token")]
        public string AccessToken { get; init; } = string.Empty;

        [JsonPropertyName("refresh_token")]
        public string? RefreshToken { get; init; }

        [JsonPropertyName("expires_in")]
        public int ExpiresIn { get; init; }
    }
}
