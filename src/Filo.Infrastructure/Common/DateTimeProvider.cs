using Filo.Domain.Common;

namespace Filo.Infrastructure.Common;

internal sealed class DateTimeProvider : IDateTimeProvider
{
    public DateTimeOffset UtcNow => DateTimeOffset.UtcNow;
}
