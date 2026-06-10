namespace Filo.Domain.Common;

public interface IDateTimeProvider
{
    DateTimeOffset UtcNow { get; }
}