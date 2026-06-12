using ErrorOr;
using Filo.Api.Models;
using Microsoft.AspNetCore.Mvc;

namespace Filo.Api.Extensions;

public static class ControllerExtensions
{
    public static IActionResult ToProblem(this ControllerBase controller, List<Error> errors)
    {
        var firstError = errors[0];

        var (statusCode, title) = firstError.Type switch
        {
            ErrorType.Validation => (StatusCodes.Status400BadRequest, "Validation Error"),
            ErrorType.NotFound => (StatusCodes.Status404NotFound, "Not Found"),
            ErrorType.Conflict => (StatusCodes.Status409Conflict, "Conflict"),
            ErrorType.Unexpected => (StatusCodes.Status500InternalServerError, "Internal Error"),
            ErrorType.Failure => (StatusCodes.Status500InternalServerError, "Internal Error"),
            _ => (StatusCodes.Status400BadRequest, "Bad Request")
        };

        Dictionary<string, string[]>? validationErrors = null;

        if (firstError.Type == ErrorType.Validation)
        {
            validationErrors = errors
                .GroupBy(e => e.Code)
                .ToDictionary(g => g.Key, g => g.Select(e => e.Description).ToArray());
        }

        var detail = firstError.Type == ErrorType.Validation
            ? "Please fix the errors below."
            : firstError.Description;

        var response = new ApiErrorResponse(title, statusCode, detail, validationErrors);

        return controller.StatusCode(statusCode, response);
    }
}
