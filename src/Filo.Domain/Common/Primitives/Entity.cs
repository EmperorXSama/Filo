namespace Filo.Domain.Common.Primitives;

public abstract class Entity<TId> : IEquatable<Entity<TId>>
where TId : struct , IEquatable<TId>
{
    public TId Id { get; protected set; }
    private readonly List<DomainEvents> _domainEvents = [];
    public IReadOnlyCollection<DomainEvents> DomainEvents => _domainEvents.AsReadOnly();
    
    protected Entity(TId id)
    {
        Id = id;
    }
    protected Entity()
    {
        
    }
    
    public void AddDomainEvents(DomainEvents domainEvent)
    {
        _domainEvents.Add(domainEvent);
    }

    public void ClearDomainEvent()
    {
        _domainEvents.Clear();
    }

    public void RemoveDomainEvent(DomainEvents domainEvent)
    {
        _domainEvents.Remove(domainEvent);
    }    
    public bool Equals(Entity<TId>? other)
    {
        if (other is null)
            return false;
        if (ReferenceEquals(this,other))
        {
            return true;
        }

        if (GetType() != other.GetType())
        {
            return false;
        }

        return Id.Equals(other.Id);
    }

    public override bool Equals(object? obj)
    {
        if (obj is null) return false;
        if (ReferenceEquals(this, obj)) return true;
        if (obj.GetType() != GetType()) return false;
        return Equals((Entity<TId>)obj);
    }

    public override int GetHashCode()
    {
        throw new NotImplementedException();
    }
}