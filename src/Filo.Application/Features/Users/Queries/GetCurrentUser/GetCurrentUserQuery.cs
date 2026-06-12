using Filo.Application.Abstractions.Messaging;

namespace Filo.Application.Features.Users.Queries.GetCurrentUser;

public sealed record GetCurrentUserQuery(string IdentityId) : IQuery<CurrentUserResponse>;
