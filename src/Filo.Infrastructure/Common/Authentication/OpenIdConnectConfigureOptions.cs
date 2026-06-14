using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Filo.Application.Abstractions.Data;
using Filo.Domain.Common.ValueObjects;
using Filo.Domain.Users;
using Filo.Domain.Users.ValueObjects;
using Filo.Infrastructure.Configuration;
using Filo.Infrastructure.Session;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Filo.Infrastructure.Common.Authentication;

internal sealed class OpenIdConnectConfigureOptions : IConfigureNamedOptions<OpenIdConnectOptions>
{
    private readonly Auth0Options _options;

    public OpenIdConnectConfigureOptions(IOptions<Auth0Options> options)
    {
        _options = options.Value;
    }

    public void Configure(string? name, OpenIdConnectOptions options)
    {
        if (name != OpenIdConnectDefaults.AuthenticationScheme)
            return;

        Configure(options);
    }

    public void Configure(OpenIdConnectOptions options)
    {
        options.Authority = $"https://{_options.Domain}";
        options.ClientId = _options.BffClientId;
        options.ClientSecret = _options.BffClientSecret;
        options.ResponseType = "code";
        options.UsePkce = true;
        options.CallbackPath = "/api/auth/callback";
        options.SignedOutCallbackPath = "/api/auth/logout/callback";

        options.Scope.Clear();
        options.Scope.Add("openid");
        options.Scope.Add("profile");
        options.Scope.Add("email");
        options.Scope.Add("offline_access");

        options.TokenValidationParameters.NameClaimType = ClaimTypes.NameIdentifier;
        options.CorrelationCookie.SameSite = SameSiteMode.Unspecified;
        options.CorrelationCookie.SecurePolicy = CookieSecurePolicy.None;
        options.CorrelationCookie.Path = "/"; 
        options.NonceCookie.Path = "/";  

        options.Events.OnRedirectToIdentityProviderForSignOut = context =>
        {
            var returnTo = $"{context.Request.Scheme}://{context.Request.Host}{context.Properties.RedirectUri ?? "/"}";
            var logoutUri = $"https://{_options.Domain}/v2/logout?client_id={_options.BffClientId}&returnTo={Uri.EscapeDataString(returnTo)}";
            context.Response.Redirect(logoutUri);
            context.HandleResponse();
            return Task.CompletedTask;
        };

        options.Events.OnRemoteFailure = context =>
        {
            var logger = context.HttpContext.RequestServices
                .GetRequiredService<ILogger<OpenIdConnectConfigureOptions>>();
            logger.LogWarning("RemoteFailure: {Message}", context.Failure?.Message);
            return Task.CompletedTask;
        };

        options.Events.OnTokenValidated = async context =>
        {
            var sessionStore = context.HttpContext.RequestServices.GetRequiredService<ISessionStore>();

            var identityId = context.Principal?.FindFirstValue("sub");

            if (identityId is null)
            {
                var idToken = context.TokenEndpointResponse?.IdToken
                              ?? context.ProtocolMessage?.IdToken;
                if (idToken is not null)
                {
                    var jwt = new JwtSecurityToken(idToken);
                    identityId = jwt.Claims.FirstOrDefault(c => c.Type == "sub")?.Value;
                }
            }

            if (identityId is null)
            {
                context.Fail("Missing subject claim.");
                return;
            }

            var identity = context.Principal?.Identities.FirstOrDefault();
            if (identity is not null && !identity.HasClaim(c => c.Type == "sub"))
            {
                identity.AddClaim(new Claim("sub", identityId));
            }

            var userId = Guid.TryParse(identityId, out var id) ? id : Guid.Empty;

            var session = new UserSession
            {
                SessionId = Guid.NewGuid(),
                UserId = userId,
                AccessToken = context.TokenEndpointResponse?.AccessToken,
                RefreshToken = context.TokenEndpointResponse?.RefreshToken,
                TokenExpiresAt = DateTimeOffset.UtcNow.AddSeconds(
                    double.TryParse(context.TokenEndpointResponse?.ExpiresIn, out var exp) ? exp : 3600),
                IpAddress = context.HttpContext.Connection.RemoteIpAddress?.ToString(),
                UserAgent = context.HttpContext.Request.Headers.UserAgent.FirstOrDefault(),
                CreatedAt = DateTimeOffset.UtcNow,
                ExpiresAt = DateTimeOffset.UtcNow.AddDays(7)
            };

            await sessionStore.CreateSessionAsync(session);

            context.Principal?.Identities.FirstOrDefault()?.AddClaim(
                new Claim(CustomClaims.SessionId, session.SessionId.ToString()));

            var userRepository = context.HttpContext.RequestServices.GetRequiredService<IUserRepository>();
            var unitOfWork = context.HttpContext.RequestServices.GetRequiredService<IUnitOfWork>();

            var ct = context.HttpContext.RequestAborted;
            var user = await userRepository.GetByIdentityIdAsync(identityId, ct);
            if (user is null && context.Principal is not null)
            {
                var givenName = context.Principal.FindFirstValue(ClaimTypes.GivenName)
                                ?? context.Principal.FindFirstValue("nickname")
                                ?? "Unknown";
                var familyName = context.Principal.FindFirstValue(ClaimTypes.Surname) ?? "";
                var emailClaim = context.Principal.FindFirstValue(ClaimTypes.Email) ?? "";

                var fullNameResult = FullName.Create(givenName, familyName);
                var emailResult = Email.Create(emailClaim);

                if (!fullNameResult.IsError && !emailResult.IsError)
                {
                    var newUser = User.Create(identityId, fullNameResult.Value, emailResult.Value, Role.Member);
                    if (!newUser.IsError)
                    {
                        userRepository.Insert(newUser.Value);
                        await unitOfWork.SaveChangesAsync(ct);
                    }
                }
            }
        };
    }
}
