namespace Filo.Application.Features.Users.Queries.GetCurrentUser;

public sealed record CurrentUserResponse(
    Guid UserId,
    string IdentityId,
    string Email,
    string FullName,
    List<string> Roles,
    HashSet<string> Permissions);
