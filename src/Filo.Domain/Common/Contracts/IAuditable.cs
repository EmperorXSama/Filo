namespace Filo.Domain.Common.Contracts;

public interface IAuditable
{
    DateTimeOffset CreatedOnUtc { get; }
    DateTimeOffset? UpdatedOnUtc { get; }
}