using System.Security.Claims;
using Filo.Infrastructure.Session;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace Filo.Infrastructure.Common.Authentication;

internal sealed class CookieConfigureOptions : IConfigureNamedOptions<CookieAuthenticationOptions>
{
    public void Configure(string? name, CookieAuthenticationOptions options)
    {
        if (name != CookieAuthenticationDefaults.AuthenticationScheme)
            return;

        Configure(options);
    }

    public void Configure(CookieAuthenticationOptions options)
    {
        options.Cookie.Name = ".Filo.Auth";
        options.Cookie.HttpOnly = true;
        options.Cookie.SameSite = SameSiteMode.Unspecified;
        options.ExpireTimeSpan = TimeSpan.FromDays(7);
        options.SlidingExpiration = true;

        options.Events.OnValidatePrincipal = async context =>
        {
            var sessionStore = context.HttpContext.RequestServices.GetRequiredService<ISessionStore>();
            var tokenRefresher = context.HttpContext.RequestServices.GetRequiredService<Auth0TokenRefresher>();

            var sessionIdClaim = context.Principal?.FindFirstValue(CustomClaims.SessionId);
            if (sessionIdClaim is null || !Guid.TryParse(sessionIdClaim, out var sessionId))
            {
                context.RejectPrincipal();
                return;
            }

            var session = await sessionStore.GetSessionAsync(sessionId);
            if (session is null || session.ExpiresAt < DateTimeOffset.UtcNow)
            {
                context.RejectPrincipal();
                return;
            }

            if (session.TokenExpiresAt < DateTimeOffset.UtcNow.AddMinutes(-5))
            {
                if (session.RefreshToken is null)
                {
                    await sessionStore.RevokeSessionAsync(sessionId);
                    context.RejectPrincipal();
                    return;
                }

                try
                {
                    var refreshResult =
                        await tokenRefresher.RefreshAsync(session.RefreshToken);

                    await sessionStore.UpdateSessionTokensAsync(sessionId, refreshResult.AccessToken, refreshResult.RefreshToken, refreshResult.ExpiresAt);
                    context.ShouldRenew = true;
                }
                catch
                {
                    await sessionStore.RevokeSessionAsync(sessionId);
                    context.RejectPrincipal();
                }
            }
        };
    }
}
