using Filo.Application.Abstractions.Data;
using Filo.Application.Abstractions.Messaging;
using Filo.Domain.Users;
using MediatR;

namespace Filo.Application.Features.Users.Queries.GetCurrentUser;

internal sealed class GetCurrentUserQueryHandler(
    IUserRepository userRepository) : IQueryHandler<GetCurrentUserQuery, CurrentUserResponse>
{
    public async Task<ErrorOr<CurrentUserResponse>> Handle(GetCurrentUserQuery request, CancellationToken ct)
    {
        var user = await userRepository.GetByIdentityIdAsync(request.IdentityId, ct);
        if (user is null)
        {
            return Error.NotFound("User.NotFound", "User not found.");
        }

        var permissions = await userRepository.GetPermissionsByUserIdAsync(user.Id, ct);

        return new CurrentUserResponse(
            user.Id.Value,
            user.IdentityId,
            user.Email.Value,
            user.FullName.ToString(),
            user.Roles.Select(r => r.Name).ToList(),
            permissions);
    }
}
