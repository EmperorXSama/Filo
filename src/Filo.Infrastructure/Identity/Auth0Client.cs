using System.Net.Http.Json;
using System.Text.Json.Serialization;
using Filo.Infrastructure.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Filo.Infrastructure.Identity;

public sealed class Auth0Client
{
    private readonly HttpClient _httpClient;
    private readonly Auth0Options _options;
    private readonly ILogger<Auth0Client> _logger;
    private readonly string _managementApiBaseUrl;

    public Auth0Client(
        HttpClient httpClient,
        IOptions<Auth0Options> options,
        ILogger<Auth0Client> logger)
    {
        _httpClient = httpClient;
        _options = options.Value;
        _logger = logger;
        _managementApiBaseUrl = $"https://{_options.Domain}/api/v2/";
    }

    public async Task<string> RegisterUserAsync(UserRepresentation user, CancellationToken cancellationToken = default)
    {
        var token = await GetManagementTokenAsync(cancellationToken);
        var request = new HttpRequestMessage(HttpMethod.Post, $"{_managementApiBaseUrl}users")
        {
            Content = JsonContent.Create(user)
        };
        request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

        var response = await _httpClient.SendAsync(request, cancellationToken);
        if (!response.IsSuccessStatusCode)
        {
            var errorBody = await response.Content.ReadAsStringAsync(cancellationToken);
            _logger.LogError("Auth0 user creation failed with {StatusCode}: {Error}", response.StatusCode, errorBody);
        }

        response.EnsureSuccessStatusCode();

        var createdUser = await response.Content.ReadFromJsonAsync<Auth0UserResponse>(cancellationToken);
        if (createdUser?.UserId is null)
        {
            throw new InvalidOperationException("Auth0 did not return a user ID in the response.");
        }

        return createdUser.UserId;
    }

    public async Task DeleteUserAsync(string auth0Id, CancellationToken cancellationToken = default)
    {
        var token = await GetManagementTokenAsync(cancellationToken);
        var request = new HttpRequestMessage(HttpMethod.Delete, $"{_managementApiBaseUrl}users/{auth0Id}");
        request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", token);

        var response = await _httpClient.SendAsync(request, cancellationToken);
        response.EnsureSuccessStatusCode();
    }

    private async Task<string> GetManagementTokenAsync(CancellationToken cancellationToken)
    {
        var formData = new Dictionary<string, string>
        {
            ["client_id"] = _options.ManagementClientId,
            ["client_secret"] = _options.ManagementClientSecret,
            ["audience"] = $"https://{_options.Domain}/api/v2/",
            ["grant_type"] = "client_credentials"
        };

        var tokenRequest = new HttpRequestMessage(HttpMethod.Post, $"https://{_options.Domain}/oauth/token")
        {
            Content = new FormUrlEncodedContent(formData)
        };

        var response = await _httpClient.SendAsync(tokenRequest, cancellationToken);
        response.EnsureSuccessStatusCode();

        var result = await response.Content.ReadFromJsonAsync<ManagementTokenResponse>(cancellationToken);
        return result?.AccessToken ?? throw new InvalidOperationException("Failed to retrieve Auth0 management token.");
    }

    private sealed record ManagementTokenResponse
    {
        [JsonPropertyName("access_token")]
        public string AccessToken { get; init; } = string.Empty;
    }

    private sealed record Auth0UserResponse
    {
        [JsonPropertyName("user_id")]
        public string UserId { get; init; } = string.Empty;
    }
}
