using FluentValidation;
using MediatR;

namespace Filo.Application.Abstractions.Behaviors;

public sealed class ValidationBehavior<TRequest,TResponse> : IPipelineBehavior<TRequest,TResponse>
where TRequest : IRequest<TResponse>
where TResponse : IErrorOr
{
    private IEnumerable<IValidator<TRequest>> _validators;

    public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators)
    {
        _validators = validators;
    }

    public async  Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        if (!_validators.Any())
            return await next(cancellationToken);

        var context = new ValidationContext<TRequest>(request);
        var validationResults =
            await Task.WhenAll(_validators.Select(v => v.ValidateAsync(context, cancellationToken)));
        var errors = validationResults
            .SelectMany(r => r.Errors)
            .Where(f => f is not null)
            .Select(f => Error.Validation(f.PropertyName, f.ErrorMessage))
            .ToList();

        if (errors.Count == 0)
        {
            return await next(cancellationToken);
        }

        return (TResponse)(dynamic)errors;
    }
}