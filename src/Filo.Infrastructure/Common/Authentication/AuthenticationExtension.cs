using Filo.Infrastructure.Session;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authentication.OpenIdConnect;
using Microsoft.Extensions.DependencyInjection;

namespace Filo.Infrastructure.Common.Authentication;

internal static class AuthenticationExtension
{
    public static IServiceCollection AddAuthenticationInternal(this IServiceCollection services)
    {
        services.AddSingleton<ITicketStore, InMemoryTicketStore>();
        services.AddSingleton<ISessionStore, InMemorySessionStore>();
        services.AddHttpClient<Auth0TokenRefresher>();

        services.ConfigureOptions<CookieConfigureOptions>();
        services.ConfigureOptions<OpenIdConnectConfigureOptions>();
        services.ConfigureOptions<JwtBearerConfigureOptions>();

        services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
            .AddCookie()
            .AddOpenIdConnect()
            .AddJwtBearer();

        return services;
    }
}
