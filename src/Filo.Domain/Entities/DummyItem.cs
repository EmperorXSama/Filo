using Filo.Domain.Common.Contracts;

namespace Filo.Domain.Entities;

public sealed class DummyItem : Common.Primitives.Entity<Guid>, IAuditable
{
    public string Name { get; private set; } = null!;
    public string? Description { get; private set; }
    public bool IsActive { get; private set; }
    public DateTimeOffset CreatedOnUtc { get; private set; }
    public DateTimeOffset? UpdatedOnUtc { get; private set; }

    private DummyItem() { }

    public DummyItem(Guid id, string name, string? description, bool isActive)
        : base(id)
    {
        Name = name;
        Description = description;
        IsActive = isActive;
    }

    public void Update(string name, string? description, bool isActive)
    {
        Name = name;
        Description = description;
        IsActive = isActive;
    }
}
