namespace Filo.Domain.Common.Contracts;

public interface ISoftDeletable
{
    bool IsDeleted { get; }
    DateTimeOffset? DeletedOnUtc { get; }
}