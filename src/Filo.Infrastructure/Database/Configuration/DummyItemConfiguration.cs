using Filo.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Filo.Infrastructure.Database.Configuration;

internal sealed class DummyItemConfiguration : IEntityTypeConfiguration<DummyItem>
{
    public void Configure(EntityTypeBuilder<DummyItem> builder)
    {
        builder.ToTable("DummyItems");

        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id).ValueGeneratedNever();
        builder.Property(x => x.Name).HasMaxLength(200).IsRequired();
        builder.Property(x => x.Description).HasMaxLength(1000);
        builder.Property(x => x.IsActive).IsRequired();
        builder.Property(x => x.CreatedOnUtc).IsRequired();
        builder.Property(x => x.UpdatedOnUtc).IsRequired();

        builder.HasIndex(x => x.Name);
        builder.HasIndex(x => x.IsActive);
    }
}
