using System.Text.Json;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Scalar.AspNetCore;

namespace Filo.Api.Extensions;

public static class ApplicationExtensions
{
    internal static WebApplication AddScalarDevelopmentExtension(this WebApplication app)
    {
        app.MapScalarApiReference(options =>
        {
            options
                .WithTitle("ServerSide Api")
                .WithDefaultHttpClient(ScalarTarget.CSharp, ScalarClient.HttpClient);
        });

        app.MapGet("/", () => Results.Redirect("/scalar/v1"))
            .ExcludeFromDescription();

        return app;
    }
    
    internal static WebApplication MapHealthCheckExtension(this WebApplication app)
    {
      
        app.MapHealthChecks("/api/health", new HealthCheckOptions
        {
            ResponseWriter = async (context, report) =>
            {
                context.Response.ContentType = "application/json";
                var response = new
                {
                    status = report.Status.ToString(),
                    checks = report.Entries.Select(e => new
                    {
                        name = e.Key,
                        status = e.Value.Status.ToString(),
                        duration = e.Value.Duration.ToString("c")
                    })
                };
                await context.Response.WriteAsJsonAsync(response, JsonSerializerOptions.Default);
            }
        });
        return app;
    }
}