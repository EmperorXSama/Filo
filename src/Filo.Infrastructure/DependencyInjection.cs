using Filo.Application.Abstractions.Authorization;
using Filo.Application.Abstractions.Data;
using Filo.Application.Abstractions.Identity;
using Filo.Application.Common.Options;
using Filo.Domain.Common;
using Filo.Domain.Entities;
using Filo.Infrastructure.Authorization;
using Filo.Infrastructure.Common;
using Filo.Infrastructure.Common.Authentication;
using Filo.Infrastructure.Common.Authorization;
using Filo.Infrastructure.Configuration;
using Filo.Infrastructure.Database;
using Filo.Infrastructure.Database.Interceptors;
using Filo.Infrastructure.Database.Repositories;
using Filo.Infrastructure.Database.Seeders;
using Filo.Infrastructure.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace Filo.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection service, IConfiguration configuration)
    {
        service.AddOptionsConfiguration();
        service.AddDatabaseSupport(configuration);
        service.AddRepositories();
        service.AddSeeders();
        service.AddCommonServices();
        service.AddAuthenticationInternal();
        service.AddAuthorizationInternal();
        service.AddAuth0Support();
        return service;
    }

    private static IServiceCollection AddOptionsConfiguration(
        this IServiceCollection service
    )
    {
        service.ConfigureOptions<EmailOptionsSetup>();
        service.AddSingleton<IValidateOptions<EmailOptions>, EmailOptionsValidator>();
        service.AddOptions<EmailOptions>()
            .ValidateOnStart();

        service.ConfigureOptions<Auth0OptionsSetup>();
        service.AddSingleton<IValidateOptions<Auth0Options>, Auth0OptionsValidator>();
        service.AddOptions<Auth0Options>()
            .ValidateOnStart();

        return service;
    }

    private static void AddDatabaseSupport(this IServiceCollection service, IConfiguration configuration)
    {
        service.AddSingleton<AuditableInterceptors>();
        service.AddSingleton<SoftDeletionInterceptors>();
        
        var connectionString = configuration.GetConnectionString("Database");
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new InvalidOperationException($"CONNECTION string is not set");
        }

        service.AddDbContext<ApplicationDbContext>((sp, options) =>
        {
            options.UseNpgsql(
                connectionString,
                builder => builder.MigrationsHistoryTable(HistoryRepository.DefaultTableName, Schemas.DefaultSchema)
            ).AddInterceptors(
                    sp.GetRequiredService<AuditableInterceptors>(),
                    sp.GetRequiredService<SoftDeletionInterceptors>()
                    );
        });

        service.AddScoped<IUnitOfWork>(sp => sp.GetRequiredService<ApplicationDbContext>());
        service.AddScoped<ICompensationService, CompensationService>();
    }

    private static void AddRepositories(this IServiceCollection service)
    {
        service.AddScoped<IRepository<DummyItem>, Repository<DummyItem>>();
        service.AddScoped<IUserRepository, UserRepository>();
    }

    private static void AddSeeders(this IServiceCollection service)
    {
        service.AddScoped<DummyDataSeeder>();
    }

    private static void AddCommonServices(this IServiceCollection service)
    {
        service.AddSingleton<IDateTimeProvider, DateTimeProvider>();
    }

    private static void AddAuth0Support(this IServiceCollection service)
    {
        service.AddHttpClient<Auth0Client>();

        service.AddScoped<IIdentityProviderService, Auth0IdentityProviderService>();
        service.AddScoped<IPermissionsService, PermissionService>();
    }
}
