using MediatR;

namespace Filo.Application.Abstractions.Messaging;

public interface IBaseQuery { }

public interface IQuery<TResponse>: IBaseQuery , IRequest<ErrorOr<TResponse>>;
public interface IQueryHandler<in TQuery , TResponse> : IRequestHandler<TQuery,ErrorOr<TResponse>>
    where TQuery: IQuery<TResponse>;