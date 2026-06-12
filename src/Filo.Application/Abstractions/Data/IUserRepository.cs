using Filo.Domain.Users;

namespace Filo.Application.Abstractions.Data;

public interface IUserRepository
{
    void Insert(User user);
    Task<User?> GetByIdentityIdAsync(string identityId, CancellationToken ct = default);
    Task<HashSet<string>> GetPermissionsByUserIdAsync(UserId userId, CancellationToken ct = default);
}
