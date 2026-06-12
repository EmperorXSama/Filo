using Filo.Application.Abstractions.Data;
using Filo.Domain.Users;
using Microsoft.EntityFrameworkCore;

namespace Filo.Infrastructure.Database.Repositories;

internal sealed class UserRepository(ApplicationDbContext context) : IUserRepository
{
    public void Insert(User user)
    {
        foreach (var role in user.Roles)
        {
            context.Attach(role);
        }

        context.Users.Add(user);
    }

    public async Task<User?> GetByIdentityIdAsync(string identityId, CancellationToken ct = default)
    {
        return await context.Users
            .Include(u => u.Roles)
            .FirstOrDefaultAsync(u => u.IdentityId == identityId, ct);
    }

    public async Task<HashSet<string>> GetPermissionsByUserIdAsync(UserId userId, CancellationToken ct = default)
    {
        var permissionCodes = await context.Database
            .SqlQueryRaw<string>(
                """
                SELECT DISTINCT rp."PermissionsCode"
                FROM "Filo"."UserRoles" ur
                JOIN "Filo"."RolePermissions" rp ON rp."RoleName" = ur."RolesName"
                WHERE ur."UserId" = {0}
                """,
                userId.Value)
            .ToListAsync(ct);

        return permissionCodes.ToHashSet();
    }
}
