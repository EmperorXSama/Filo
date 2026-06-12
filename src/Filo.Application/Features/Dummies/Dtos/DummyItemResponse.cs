namespace Filo.Application.Features.Dummies.Dtos;

public sealed record DummyItemResponse(
    Guid Id,
    string Name,
    string? Description,
    bool IsActive,
    DateTimeOffset CreatedOnUtc,
    DateTimeOffset? UpdatedOnUtc
);
