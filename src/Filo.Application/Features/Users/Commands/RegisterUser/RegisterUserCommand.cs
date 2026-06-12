using Filo.Application.Abstractions.Messaging;

namespace Filo.Application.Features.Users.Commands.RegisterUser;

public sealed record RegisterUserCommand(
    string Email,
    string Password,
    string FirstName,
    string LastName) : ICommand<RegisterUserResponse>;
