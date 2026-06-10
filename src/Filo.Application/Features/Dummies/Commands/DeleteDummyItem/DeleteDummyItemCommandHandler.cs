using Filo.Application.Abstractions.Data;
using Filo.Application.Abstractions.Messaging;
using Filo.Domain.Entities;
using MediatR;

namespace Filo.Application.Features.Dummies.Commands.DeleteDummyItem;

internal sealed class DeleteDummyItemCommandHandler(IRepository<DummyItem> repository)
    : IRequestHandler<DeleteDummyItemCommand, ErrorOr<bool>>
{
    public async Task<ErrorOr<bool>> Handle(DeleteDummyItemCommand request, CancellationToken ct)
    {
        var entity = await repository.GetByIdAsync(request.Id, ct);
        if (entity is null)
            return Error.NotFound("DummyItem.NotFound", $"DummyItem with id '{request.Id}' was not found.");

        repository.Remove(entity);

        return true;
    }
}
