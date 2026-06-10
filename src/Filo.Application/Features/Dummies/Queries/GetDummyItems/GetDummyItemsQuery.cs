using Filo.Application.Abstractions.Messaging;
using Filo.Application.Features.Dummies.Dtos;

namespace Filo.Application.Features.Dummies.Queries.GetDummyItems;

public sealed record GetDummyItemsQuery : IQuery<List<DummyItemResponse>>;
