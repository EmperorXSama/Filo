using ErrorOr;

namespace Filo.Application.Abstractions.Identity;

public interface IIdentityProviderService
{
    Task<ErrorOr<string>> RegisterUserAsync(UserModel user, CancellationToken cancellationToken = default);
    Task<ErrorOr<Success>> DeleteUserAsync(string auth0Id, CancellationToken cancellationToken = default);
}
