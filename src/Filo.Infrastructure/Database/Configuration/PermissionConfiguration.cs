using Filo.Domain.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Filo.Infrastructure.Database.Configuration;

public class PermissionConfiguration : IEntityTypeConfiguration<Permissions>
{
    public void Configure(EntityTypeBuilder<Permissions> builder)
    {
        builder.ToTable("Permissions");
        builder.HasKey(p => p.Code);
        builder.Property(p => p.Code).HasMaxLength(100);

        builder.HasData(
            Permissions.CreateSpaces,
            Permissions.ReadAllSpaces,
            Permissions.ReadSpaces,
            Permissions.UploadDownload,
            Permissions.UploadFiles
        );
        builder
            .HasMany<Role>()
            .WithMany()
            .UsingEntity(joinBuilder =>
            {
                joinBuilder.ToTable("RolePermissions");
                joinBuilder.HasData(
                    CreateRolePermission(Role.Administrator, Permissions.CreateSpaces),
                    CreateRolePermission(Role.Administrator, Permissions.ReadAllSpaces),
                    CreateRolePermission(Role.Administrator, Permissions.ReadSpaces),
                    CreateRolePermission(Role.Administrator, Permissions.UploadFiles),
                    CreateRolePermission(Role.Administrator, Permissions.UploadDownload),
                    CreateRolePermission(Role.Member, Permissions.CreateSpaces),
                    CreateRolePermission(Role.Member, Permissions.ReadSpaces),
                    CreateRolePermission(Role.Member, Permissions.UploadFiles),
                    CreateRolePermission(Role.Member, Permissions.UploadDownload)
                );
                });
    }

    private static object CreateRolePermission(Role role, Permissions permissions)
    {
        return new
        {
            RoleName = role.Name,
            PermissionsCode = permissions.Code
        };
    }
}