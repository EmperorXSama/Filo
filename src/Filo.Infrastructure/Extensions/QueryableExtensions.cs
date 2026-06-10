using Filo.Application.Common.Models;
using Microsoft.EntityFrameworkCore;

namespace Filo.Infrastructure.Extensions;

public static class QueryableExtensions
{
    public static async Task<PagedList<T>> ToPagedListAsync<T>(
        this IQueryable<T> query,
        PaginationRequest request,
        CancellationToken cancellationToken = default
        )
    {
        var totalCount = await query.CountAsync(cancellationToken);

        var items = await query
            .Skip((request.PageNumber - 1) * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);

        return new PagedList<T>(items, request.PageNumber, request.PageSize, totalCount);
    }
}