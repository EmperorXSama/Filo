using System.Windows.Input;
using MediatR;

namespace Filo.Application.Abstractions.Messaging;

public interface IBaseCommand{}
public interface ICommand<TResponse> : IBaseCommand , IRequest<ErrorOr<TResponse>>;
public interface ICommandHandler<in TCommand , TResponse> : IRequestHandler<TCommand , ErrorOr<TResponse>>
    where TCommand : ICommand<TResponse>;

public interface ICommandHandler<in TCommand> : IRequestHandler<TCommand , ErrorOr<Success>>
    where TCommand : ICommand, IRequest<ErrorOr<Success>>;