using MediatR;

namespace Filo.Domain.Common.Primitives;

public abstract record DomainEvents : INotification
{
    public Guid EventId { get; } = Guid.NewGuid();
    public DateTimeOffset Type { get; set; } = DateTimeOffset.UtcNow;
}