using System.Text.RegularExpressions;
using ErrorOr;
namespace Filo.Domain.Common.ValueObjects;

public sealed partial record Email
{
    private static readonly Regex EmailRegex = EmailRegexPattern();

    public string Value { get; init; }

    private Email(string value)
    {
        Value = value;
    }
    
    public static ErrorOr<Email> Create(string value)
    {
        if (string.IsNullOrWhiteSpace(value))
        {
            return Error.Validation(
                "Email.Empty",
                "Email cannot be empty.");
        }

        if (value.Length > 254)
        {
            return Error.Validation(
                "Email.TooLong",
                "Email cannot exceed 254 characters.");
        }

        if (!EmailRegex.IsMatch(value))
        {
            return Error.Validation(
                "Email.InvalidFormat",
                "Email format is invalid.");
        }

        return new Email(value.ToLowerInvariant());
    }
    
    
    [GeneratedRegex(@"^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
        RegexOptions.Compiled | RegexOptions.NonBacktracking)]
    private static partial Regex EmailRegexPattern();
}