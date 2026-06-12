using System.Security.Claims;
using Filo.Infrastructure.Common.Authentication;
using MediatR;
using Microsoft.AspNetCore.Authentication;

namespace Filo.Infrastructure.Common.Authorization;

internal sealed class CustomClaimsTransformation : IClaimsTransformation
{
    private readonly ISender _sender;

    public CustomClaimsTransformation(ISender sender)
    {
        _sender = sender;
    }

    public async Task<ClaimsPrincipal> TransformAsync(ClaimsPrincipal principal)
    {
        if (principal.Identity?.IsAuthenticated != true)
            return principal;

        var identityId = principal.FindFirstValue("sub");
        if (identityId is null)
            return principal;

        var result = await _sender.Send(new Application.Features.Users.Queries.GetUserPermission.GetUserPermissionQuery(identityId));
        if (result.IsError)
            return principal;

        var identity = new ClaimsIdentity();
        foreach (var permission in result.Value.Permissions)
        {
            identity.AddClaim(new Claim(CustomClaims.Permission, permission));
        }

        principal.AddIdentity(identity);
        return principal;
    }
}
