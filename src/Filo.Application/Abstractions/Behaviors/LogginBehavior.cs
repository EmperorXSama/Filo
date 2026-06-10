using System.Diagnostics;
using MediatR;
using Microsoft.Extensions.Logging;

namespace Filo.Application.Abstractions.Behaviors;

public class LoggingBehavior<TRequest,TResponse> :IPipelineBehavior<TRequest,TResponse>
where TRequest : IRequest<TResponse>
where TResponse : IErrorOr
{
    private readonly ILogger<LoggingBehavior<TRequest, TResponse>> _logger;
    public LoggingBehavior(ILogger<LoggingBehavior<TRequest, TResponse>> logger)
    {
        _logger = logger;
    }
    
    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        var requestName = typeof(TRequest).Name;

        var stopwatch = Stopwatch.StartNew();
        var response = await next(cancellationToken);
        stopwatch.Stop();
        if (response.IsError)
        {
            _logger.LogWarning(
                "Failed {Request} in {Elapsed}ms: {Errors}",
                requestName,
                stopwatch.ElapsedMilliseconds,
                response.Errors
                );
        }
        else
        {
            _logger.LogInformation(
                "Completed {Request} in {Elapsed}ms",
                requestName,
                stopwatch.ElapsedMilliseconds);
        }

        return response;
        
    }
}