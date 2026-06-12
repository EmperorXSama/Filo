using Filo.Application.Abstractions.Authorization;
using Filo.Application.Abstractions.Data;
using Filo.Application.Abstractions.Messaging;
using MediatR;

namespace Filo.Application.Features.Users.Queries.GetUserPermission;

internal sealed class GetUserPermissionQueryHandler(
    IUserRepository userRepository) : IQueryHandler<GetUserPermissionQuery, PermissionsResponse>
{
    public async Task<ErrorOr<PermissionsResponse>> Handle(GetUserPermissionQuery request, CancellationToken ct)
    {
        var user = await userRepository.GetByIdentityIdAsync(request.IdentityId, ct);
        if (user is null)
        {
            return Error.NotFound("User.NotFound", "User not found.");
        }

        var permissions = await userRepository.GetPermissionsByUserIdAsync(user.Id, ct);

        return new PermissionsResponse(user.Id.Value, permissions);
    }
}
