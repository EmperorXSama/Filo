namespace Filo.Domain.Common.Primitives;

public abstract class AggregateRoot<TId> : Entity<TId>
where TId : struct , IEquatable<TId>
{ 
    protected  AggregateRoot()
    {
    }

    protected AggregateRoot(TId id ): base(id)
    {
        
    }
}