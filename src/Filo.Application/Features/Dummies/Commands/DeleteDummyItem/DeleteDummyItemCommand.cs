using Filo.Application.Abstractions.Messaging;

namespace Filo.Application.Features.Dummies.Commands.DeleteDummyItem;

public sealed record DeleteDummyItemCommand(Guid Id) : ICommand<bool>;
