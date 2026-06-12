using Filo.Application.Abstractions.Data;
using Filo.Application.Abstractions.Messaging;
using MediatR;

namespace Filo.Application.Abstractions.Behaviors;
public sealed class UnitOfWorkBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
    where TResponse : IErrorOr
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICompensationService _compensationService;

    public UnitOfWorkBehavior(IUnitOfWork unitOfWork, ICompensationService compensationService)
    {
        _unitOfWork = unitOfWork;
        _compensationService = compensationService;
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
            try
            {
                await _unitOfWork.SaveChangesAsync(ct);
            }
            catch
            {
                await _compensationService.ExecuteAllAsync(ct);
                await _unitOfWork.RollbackAsync(ct);

                var errors = new List<Error>
                {
                    Error.Unexpected("Database.Error", "An unexpected error occurred. Please try again later.")
                };

                return (TResponse)(dynamic)errors;
            }
        }

        return response;
    }
}