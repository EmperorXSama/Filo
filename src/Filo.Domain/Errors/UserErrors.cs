using ErrorOr;

namespace Filo.Domain.Errors;
public static class UserErrors
{
    public static Error NotFound(string userId) =>
        Error.NotFound("User.NotFound", $"User with ID '{userId}' was not found.");

    public static Error EmailAlreadyExists(string email) =>
        Error.Conflict("User.EmailAlreadyExists", $"The email '{email}' is already in use.");

    public static Error AlreadyActive =>
        Error.Conflict("User.AlreadyActive", "The user is already active.");

    public static Error AlreadyInactive =>
        Error.Conflict("User.AlreadyInactive", "The user is already inactive.");

    public static Error SameEmail =>
        Error.Validation("User.SameEmail", "The new email is the same as the current email.");
    public static Error UserNotFound(Guid userId) => 
        Error.NotFound("Users.NotFound", $"The user with the identifier {userId} not found");
    public static Error UserNotFound(string identityId) => 
        Error.NotFound("Users.NotFound", $"The user with the IDP identifier {identityId} not found");
    
}
