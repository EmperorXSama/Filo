using Filo.Application.Abstractions.Data;
using Filo.Application.Abstractions.Messaging;
using Filo.Application.Features.Dummies.Dtos;
using Filo.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Filo.Application.Features.Dummies.Queries.GetDummyItems;

internal sealed class GetDummyItemsQueryHandler(IRepository<DummyItem> repository)
    : IRequestHandler<GetDummyItemsQuery, ErrorOr<List<DummyItemResponse>>>
{
    public async Task<ErrorOr<List<DummyItemResponse>>> Handle(GetDummyItemsQuery request, CancellationToken ct)
    {
        var items = await repository
            .GetAll()
            .Select(d => new DummyItemResponse(
                d.Id,
                d.Name,
                d.Description,
                d.IsActive,
                d.CreatedOnUtc,
                d.UpdatedOnUtc
            ))
            .ToListAsync(ct);

        return items;
    }
}
