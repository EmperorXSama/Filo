using Filo.Infrastructure.Common.Authentication;
using Microsoft.AspNetCore.Authorization;

namespace Filo.Infrastructure.Common.Authorization;

internal sealed class PermissionAuthorizationHandler : AuthorizationHandler<PermissionRequirement>
{
    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, PermissionRequirement requirement)
    {
        var permissions = context.User.FindAll(CustomClaims.Permission)
            .Select(c => c.Value)
            .ToHashSet();

        if (permissions.Contains(requirement.Permission))
        {
            context.Succeed(requirement);
        }

        return Task.CompletedTask;
    }
}
