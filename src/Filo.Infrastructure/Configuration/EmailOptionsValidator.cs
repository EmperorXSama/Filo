using Filo.Application.Common.Options;
using Microsoft.Extensions.Options;

namespace Filo.Infrastructure.Configuration;

public sealed class EmailOptionsValidator : IValidateOptions<EmailOptions>
{
    public ValidateOptionsResult Validate(string? name, EmailOptions options)
    {
        var failures = new List<string>();
        if (string.IsNullOrWhiteSpace(options.FromAddress))
        {
            failures.Add($"{nameof(options.FromAddress)} is required.");
        }
        if (string.IsNullOrWhiteSpace(options.SmtpHost))
        {
            failures.Add($"{nameof(options.SmtpHost)} is required.");
        }
        if (string.IsNullOrWhiteSpace(options.SmtpPort.ToString()))
        {
            failures.Add($"{nameof(options.SmtpPort)} is required.");
        }
        return failures.Count > 0
            ? ValidateOptionsResult.Fail(failures)
            : ValidateOptionsResult.Success;
    }
}