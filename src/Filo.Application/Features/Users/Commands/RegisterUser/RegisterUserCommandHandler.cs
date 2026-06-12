using Filo.Application.Abstractions.Data;
using Filo.Application.Abstractions.Identity;
using Filo.Application.Abstractions.Messaging;
using Filo.Domain.Common.ValueObjects;
using Filo.Domain.Users;
using Filo.Domain.Users.ValueObjects;
using MediatR;

namespace Filo.Application.Features.Users.Commands.RegisterUser;

internal sealed class RegisterUserCommandHandler(
    IIdentityProviderService identityProviderService,
    IUserRepository userRepository,
    ICompensationService compensationService) : IRequestHandler<RegisterUserCommand, ErrorOr<RegisterUserResponse>>
{
    public async Task<ErrorOr<RegisterUserResponse>> Handle(RegisterUserCommand request, CancellationToken ct)
    {
        var auth0Result = await identityProviderService.RegisterUserAsync(
            new UserModel(request.Email, request.Password, request.FirstName, request.LastName), ct);

        if (auth0Result.IsError)
            return auth0Result.Errors;

        var auth0Id = auth0Result.Value;

        compensationService.Register(c => identityProviderService.DeleteUserAsync(auth0Id, c));

        var fullNameResult = FullName.Create(request.FirstName, request.LastName);
        if (fullNameResult.IsError)
        {
            await compensationService.ExecuteAllAsync(ct);
            return fullNameResult.Errors;
        }

        var emailResult = Email.Create(request.Email);
        if (emailResult.IsError)
        {
            await compensationService.ExecuteAllAsync(ct);
            return emailResult.Errors;
        }

        var userResult = User.Create(auth0Id, fullNameResult.Value, emailResult.Value, Role.Member);
        if (userResult.IsError)
        {
            await compensationService.ExecuteAllAsync(ct);
            return userResult.Errors;
        }

        userRepository.Insert(userResult.Value);

        return new RegisterUserResponse(userResult.Value.Id.Value);
    }
}
