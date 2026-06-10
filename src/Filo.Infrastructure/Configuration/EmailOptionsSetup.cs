using Filo.Application.Common.Options;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace Filo.Infrastructure.Configuration;

public class EmailOptionsSetup : IConfigureOptions<EmailOptions>
{
    private const string SectionName = EmailOptions.SectionName;
    private readonly IConfiguration _configuration;

    public EmailOptionsSetup(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public void Configure(EmailOptions options)
    {
        _configuration.GetSection(SectionName)
            .Bind(options);
    }
}