using ErrorOr;
using Filo.Application.Abstractions.Authorization;
using MediatR;

namespace Filo.Infrastructure.Authorization;

internal sealed class PermissionService(ISender sender) : IPermissionsService
{
    public async Task<ErrorOr<PermissionsResponse>> GetUserPermissions(string identityId, CancellationToken ct = default)
    {
        return await sender.Send(new Application.Features.Users.Queries.GetUserPermission.GetUserPermissionQuery(identityId), ct);
    }
}
