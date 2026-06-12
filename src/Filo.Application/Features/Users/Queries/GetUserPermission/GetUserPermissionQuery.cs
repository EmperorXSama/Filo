using Filo.Application.Abstractions.Authorization;
using Filo.Application.Abstractions.Messaging;

namespace Filo.Application.Features.Users.Queries.GetUserPermission;

public sealed record GetUserPermissionQuery(string IdentityId) : IQuery<PermissionsResponse>;
