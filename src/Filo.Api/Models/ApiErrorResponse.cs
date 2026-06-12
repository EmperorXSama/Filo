namespace Filo.Api.Models;

public sealed record ApiErrorResponse(
    string Title,
    int StatusCode,
    string Detail,
    Dictionary<string, string[]>? Errors
);
