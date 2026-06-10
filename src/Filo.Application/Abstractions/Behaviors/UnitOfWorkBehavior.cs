using Filo.Application.Abstractions.Data;
using Filo.Application.Abstractions.Messaging;
using MediatR;

namespace Filo.Application.Abstractions.Behaviors;
public sealed class UnitOfWorkBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
    where TResponse : IErrorOr
{
    private readonly IUnitOfWork _unitOfWork;

    public UnitOfWorkBehavior(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken ct)
    {
        if (request is not  IBaseCommand)
        {
            return  await next(ct);
        }

        var response = await next(ct);
        if (!response.IsError)
        {
            await _unitOfWork.SaveChangesAsync(ct);
        }

        return response;
    }
}