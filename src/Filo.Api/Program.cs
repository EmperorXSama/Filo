using Filo.Api.Extensions;
using Filo.Application;
using Filo.Infrastructure;
using Filo.Infrastructure.Database.Seeders;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using Scalar.AspNetCore;
using System.Text.Json;
using Microsoft.AspNetCore.HttpOverrides;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddOpenApi();
builder.Services.AddHealthChecks();
builder.Configuration.AddKeyVaultSupport(builder.Environment);

builder.Services.AddApplicationLayer();
builder.Services.AddInfrastructure(builder.Configuration);


builder.Services.Configure<ForwardedHeadersOptions>(options =>
{
    options.ForwardedHeaders =
        ForwardedHeaders.XForwardedFor |
        ForwardedHeaders.XForwardedProto;

    options.KnownNetworks.Clear();
    options.KnownProxies.Clear();
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.AddScalarDevelopmentExtension();

    await app.ApplyMigrationsAsync();

    using (var scope = app.Services.CreateScope())
    {
        var seeder = scope.ServiceProvider.GetRequiredService<DummyDataSeeder>();
        await seeder.SeedAsync();
    }
}

app.MapControllers();
app.MapHealthCheckExtension();


app.Run();

