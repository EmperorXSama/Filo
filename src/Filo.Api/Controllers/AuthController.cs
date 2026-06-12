using System.Security.Claims;
using Filo.Api.Extensions;
using Filo.Application.Features.Users.Queries.GetCurrentUser;
using MediatR;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Mvc;

namespace Filo.Api.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController(ISender sender) : ControllerBase
{
    [HttpGet("login")]
    public IActionResult Login(string? returnUrl)
    {
        var redirectUri = returnUrl ?? "/";
        var properties = new AuthenticationProperties { RedirectUri = redirectUri };
        return Challenge(properties, OpenIdConnectDefaults.AuthenticationScheme);
    }

    [HttpGet("logout")]
    public async Task<IActionResult> Logout(string? returnUrl)
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

        var redirectUri = returnUrl ?? "/";
        var properties = new AuthenticationProperties { RedirectUri = redirectUri };
        return SignOut(properties, OpenIdConnectDefaults.AuthenticationScheme);
    }

    [HttpGet("check_session")]
    public IActionResult CheckSession()
    {
        if (User.Identity?.IsAuthenticated != true)
            return Unauthorized();

        var claims = User.Claims
            .GroupBy(c => c.Type)
            .ToDictionary(g => g.Key, g => g.Select(c => c.Value).ToList());
        return Ok(claims);
    }

    [HttpGet("me")]
    public async Task<IActionResult> Me(CancellationToken ct)
    {
        if (User.Identity?.IsAuthenticated != true)
            return Unauthorized();

        var identityId = User.FindFirstValue("sub");
        if (identityId is null)
            return Unauthorized();

        var result = await sender.Send(new GetCurrentUserQuery(identityId), ct);
        return result.Match<IActionResult>(Ok, errors => this.ToProblem(errors));
    }
}
