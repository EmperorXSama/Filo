using Microsoft.Extensions.Options;

namespace Filo.Infrastructure.Configuration;

internal sealed class Auth0OptionsValidator : IValidateOptions<Auth0Options>
{
    public ValidateOptionsResult Validate(string? name, Auth0Options options)
    {
        var failures = new List<string>();

        if (string.IsNullOrWhiteSpace(options.Domain))
            failures.Add("Auth0:Domain is required");
        if (string.IsNullOrWhiteSpace(options.ManagementClientId))
            failures.Add("Auth0:ManagementClientId is required");
        if (string.IsNullOrWhiteSpace(options.ManagementClientSecret))
            failures.Add("Auth0:ManagementClientSecret is required");
        if (string.IsNullOrWhiteSpace(options.BffClientId))
            failures.Add("Auth0:BffClientId is required");
        if (string.IsNullOrWhiteSpace(options.BffClientSecret))
            failures.Add("Auth0:BffClientSecret is required");
        if (string.IsNullOrWhiteSpace(options.Audience))
            failures.Add("Auth0:Audience is required");

        return failures.Count > 0
            ? ValidateOptionsResult.Fail(failures)
            : ValidateOptionsResult.Success;
    }
}
