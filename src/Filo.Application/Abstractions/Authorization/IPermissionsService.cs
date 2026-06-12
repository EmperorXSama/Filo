using ErrorOr;

namespace Filo.Application.Abstractions.Authorization;

public interface IPermissionsService
{
    Task<ErrorOr<PermissionsResponse>> GetUserPermissions(string identityId, CancellationToken ct = default);
}
