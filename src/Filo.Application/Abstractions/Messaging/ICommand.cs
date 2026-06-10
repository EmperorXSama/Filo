using MediatR;

namespace Filo.Application.Abstractions.Messaging;

public interface IBaseCommand{}
public interface ICommand<TResponse> : IBaseCommand , IRequest<ErrorOr<TResponse>>;