using ErrorOr;
using Filo.Application.Abstractions.Identity;
using Microsoft.Extensions.Logging;

namespace Filo.Infrastructure.Identity;

internal sealed class Auth0IdentityProviderService(
    Auth0Client auth0Client,
    ILogger<Auth0IdentityProviderService> logger) : IIdentityProviderService
{
    public async Task<ErrorOr<string>> RegisterUserAsync(UserModel user, CancellationToken cancellationToken = default)
    {
        var userRepresentation = new UserRepresentation(
            user.Email,
            user.Password,
            user.FirstName,
            user.LastName);

        try
        {
            var auth0Id = await auth0Client.RegisterUserAsync(userRepresentation, cancellationToken);
            return auth0Id;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to register user with Auth0");
            return Error.Unexpected("Auth0.UserRegistrationFailed", "Failed to register user. Please try again later.");
        }
    }

    public async Task<ErrorOr<Success>> DeleteUserAsync(string auth0Id, CancellationToken cancellationToken = default)
    {
        try
        {
            await auth0Client.DeleteUserAsync(auth0Id, cancellationToken);
            return Result.Success;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to delete user {Auth0Id} from Auth0", auth0Id);
            return Error.Unexpected("Auth0.UserDeletionFailed", "Failed to delete user from identity provider.");
        }
    }
}
