using Filo.Application.Abstractions.Behaviors;
using FluentValidation;
using Microsoft.Extensions.DependencyInjection;

namespace Filo.Application;

public static class DependencyInjection
{
    public static IServiceCollection AddApplicationLayer(this IServiceCollection services)
    {
        services.AddMediatr();
        services.AddValidators();
        return services;
    }

    private static void AddMediatr(this IServiceCollection service)
    {
        service.AddMediatR(mdr =>
        {
            mdr.RegisterServicesFromAssembly(AssemblyReference.ApplicationAssembly);
            mdr.AddOpenBehavior(typeof(LoggingBehavior<,>));
            mdr.AddOpenBehavior(typeof(ValidationBehavior<,>));
            mdr.AddOpenBehavior(typeof(UnitOfWorkBehavior<,>));
        });
    }

    private static void AddValidators(this IServiceCollection service)
    {
        service.AddValidatorsFromAssembly(AssemblyReference.ApplicationAssembly,ServiceLifetime.Transient);
    }
}