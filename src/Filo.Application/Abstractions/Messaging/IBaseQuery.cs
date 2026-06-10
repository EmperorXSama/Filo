using MediatR;

namespace Filo.Application.Abstractions.Messaging;

public interface IBaseQuery { }

public interface IQuery<TResponse>: IBaseQuery , IRequest<ErrorOr<TResponse>>;