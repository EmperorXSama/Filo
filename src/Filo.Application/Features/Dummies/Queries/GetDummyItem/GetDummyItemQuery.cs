using Filo.Application.Abstractions.Messaging;
using Filo.Application.Features.Dummies.Dtos;

namespace Filo.Application.Features.Dummies.Queries.GetDummyItem;

public sealed record GetDummyItemQuery(Guid Id) : IQuery<DummyItemResponse>;
