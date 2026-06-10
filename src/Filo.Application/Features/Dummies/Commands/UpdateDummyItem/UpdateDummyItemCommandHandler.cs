using Filo.Application.Abstractions.Data;
using Filo.Application.Abstractions.Messaging;
using Filo.Application.Features.Dummies.Dtos;
using Filo.Domain.Entities;
using MediatR;

namespace Filo.Application.Features.Dummies.Commands.UpdateDummyItem;

internal sealed class UpdateDummyItemCommandHandler(IRepository<DummyItem> repository)
    : IRequestHandler<UpdateDummyItemCommand, ErrorOr<DummyItemResponse>>
{
    public async Task<ErrorOr<DummyItemResponse>> Handle(UpdateDummyItemCommand request, CancellationToken ct)
    {
        var entity = await repository.GetByIdAsync(request.Id, ct);
        if (entity is null)
            return Error.NotFound("DummyItem.NotFound", $"DummyItem with id '{request.Id}' was not found.");

        entity.Update(request.Name, request.Description, request.IsActive);
        repository.Update(entity);

        return new DummyItemResponse(
            entity.Id,
            entity.Name,
            entity.Description,
            entity.IsActive,
            entity.CreatedOnUtc,
            entity.UpdatedOnUtc
        );
    }
}
