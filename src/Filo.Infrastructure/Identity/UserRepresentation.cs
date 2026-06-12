using System.Text.Json.Serialization;

namespace Filo.Infrastructure.Identity;

public sealed record UserRepresentation
{
    [JsonPropertyName("email")]
    public string Email { get; init; }

    [JsonPropertyName("password")]
    public string Password { get; init; }

    [JsonPropertyName("connection")]
    public string Connection { get; init; }

    [JsonPropertyName("email_verified")]
    public bool EmailVerified { get; init; }

    [JsonPropertyName("given_name")]
    public string GivenName { get; init; }

    [JsonPropertyName("family_name")]
    public string FamilyName { get; init; }

    [JsonPropertyName("name")]
    public string Name { get; init; }

    public UserRepresentation(
        string email,
        string password,
        string givenName,
        string familyName)
    {
        Email = email;
        Password = password;
        Connection = "Username-Password-Authentication";
        EmailVerified = true;
        GivenName = givenName;
        FamilyName = familyName;
        Name = $"{givenName} {familyName}";
    }
}
