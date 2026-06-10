using Filo.Application.Abstractions.Data;
using Filo.Application.Abstractions.Messaging;
using Filo.Application.Features.Dummies.Dtos;
using Filo.Domain.Entities;
using MediatR;

namespace Filo.Application.Features.Dummies.Commands.CreateDummyItem;

internal sealed class CreateDummyItemCommandHandler(IRepository<DummyItem> repository)
    : IRequestHandler<CreateDummyItemCommand, ErrorOr<DummyItemResponse>>
{
    public async Task<ErrorOr<DummyItemResponse>> Handle(CreateDummyItemCommand request, CancellationToken ct)
    {
        var entity = new DummyItem(Guid.NewGuid(), request.Name, request.Description, request.IsActive);

        repository.Add(entity);

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
