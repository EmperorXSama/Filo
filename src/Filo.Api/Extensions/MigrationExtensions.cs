using Filo.Infrastructure.Database;
using Microsoft.EntityFrameworkCore;

namespace Filo.Api.Extensions;

internal static class MigrationExtensions
{
    public static async Task ApplyMigrationsAsync(this WebApplication app)
    {
        using var scope = app.Services.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        await context.Database.MigrateAsync();
    }
}
