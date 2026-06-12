using Filo.Domain.Users;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Filo.Infrastructure.Database.Configuration;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users");
        builder.HasKey(u => u.Id);
        builder.HasIndex(u => u.IdentityId);
        builder.Property(u => u.Id)
            .HasConversion(
                id => id.Value,
                value => UserId.From(value)
            ).ValueGeneratedNever();

        builder.ComplexProperty(u => u.FullName, fullNameBuilder =>
        {
            fullNameBuilder.Property(f => f.FirstName)
                .HasMaxLength(100)
                .IsRequired();

            fullNameBuilder.Property(f => f.LastName)
                .HasMaxLength(100)
                .IsRequired();
        });
        builder.ComplexProperty(u => u.Email, email =>
        {
            email.Property(e => e.Value)
                .HasColumnName("Email")
                .HasMaxLength(254)
                .IsRequired();
        });
        builder.Property(u => u.Status)
            .HasConversion<string>()   // stores "Active", "Inactive"
            .HasMaxLength(20)
            .IsRequired();
        builder.Property(u => u.CreatedOnUtc).IsRequired();
        builder.Property(u => u.UpdatedOnUtc);

        builder.Property(u => u.IsDeleted).IsRequired().HasDefaultValue(false);
        builder.Property(u => u.DeletedOnUtc);

        builder.HasIndex(u => u.IsDeleted);
    }
}