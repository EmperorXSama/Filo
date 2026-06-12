using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace Filo.Infrastructure.Configuration;

internal sealed class Auth0OptionsSetup : IConfigureOptions<Auth0Options>
{
    private const string SectionName = Auth0Options.SectionName;
    private readonly IConfiguration _configuration;

    public Auth0OptionsSetup(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public void Configure(Auth0Options options)
    {
        _configuration.GetSection(SectionName)
            .Bind(options);
    }
}
