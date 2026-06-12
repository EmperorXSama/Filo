using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection;

namespace Filo.Infrastructure.Common.Authorization;

internal static class AuthorizationExtension
{
    public static IServiceCollection AddAuthorizationInternal(this IServiceCollection services)
    {
        services.AddScoped<IClaimsTransformation, CustomClaimsTransformation>();
        services.AddSingleton<IAuthorizationHandler, PermissionAuthorizationHandler>();
        services.AddSingleton<IAuthorizationPolicyProvider, PermissionAuthorizationPolicyProvider>();

        return services;
    }
}
