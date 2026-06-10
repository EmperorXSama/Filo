using Filo.Application.Abstractions.Messaging;
using Filo.Application.Features.Dummies.Dtos;

namespace Filo.Application.Features.Dummies.Commands.UpdateDummyItem;

public sealed record UpdateDummyItemCommand(Guid Id, string Name, string? Description, bool IsActive)
    : ICommand<DummyItemResponse>;
