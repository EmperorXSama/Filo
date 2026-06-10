using Filo.Application.Abstractions.Data;
using Filo.Application.Abstractions.Messaging;
using Filo.Application.Features.Dummies.Dtos;
using Filo.Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Filo.Application.Features.Dummies.Queries.GetDummyItem;

internal sealed class GetDummyItemQueryHandler(IRepository<DummyItem> repository)
    : IRequestHandler<GetDummyItemQuery, ErrorOr<DummyItemResponse>>
{
    public async Task<ErrorOr<DummyItemResponse>> Handle(GetDummyItemQuery request, CancellationToken ct)
    {
        var entity = await repository
            .GetAll()
            .Where(d => d.Id == request.Id)
            .Select(d => new DummyItemResponse(
                d.Id,
                d.Name,
                d.Description,
                d.IsActive,
                d.CreatedOnUtc,
                d.UpdatedOnUtc
            ))
            .FirstOrDefaultAsync(ct);

        if (entity is null)
            return Error.NotFound("DummyItem.NotFound", $"DummyItem with id '{request.Id}' was not found.");

        return entity;
    }
}
