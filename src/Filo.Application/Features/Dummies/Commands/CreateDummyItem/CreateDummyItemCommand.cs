using Filo.Application.Abstractions.Messaging;
using Filo.Application.Features.Dummies.Dtos;

namespace Filo.Application.Features.Dummies.Commands.CreateDummyItem;

public sealed record CreateDummyItemCommand(string Name, string? Description, bool IsActive)
    : ICommand<DummyItemResponse>;
