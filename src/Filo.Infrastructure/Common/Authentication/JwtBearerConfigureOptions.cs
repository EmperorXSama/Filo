using System.Security.Claims;
using Filo.Infrastructure.Configuration;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Options;

namespace Filo.Infrastructure.Common.Authentication;

internal sealed class JwtBearerConfigureOptions : IConfigureNamedOptions<JwtBearerOptions>
{
    private readonly Auth0Options _options;

    public JwtBearerConfigureOptions(IOptions<Auth0Options> options)
    {
        _options = options.Value;
    }

    public void Configure(string? name, JwtBearerOptions options)
    {
        if (name != JwtBearerDefaults.AuthenticationScheme)
            return;

        Configure(options);
    }

    public void Configure(JwtBearerOptions options)
    {
        options.Authority = $"https://{_options.Domain}";
        options.Audience = _options.Audience;
        options.TokenValidationParameters.NameClaimType = ClaimTypes.NameIdentifier;
    }
}
