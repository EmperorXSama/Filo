using ErrorOr;
using Filo.Domain.Common.Contracts;
using Filo.Domain.Common.Primitives;
using Filo.Domain.Common.ValueObjects;
using Filo.Domain.Errors;
using Filo.Domain.Users.Enums;
using Filo.Domain.Users.ValueObjects;

namespace Filo.Domain.Users;

public class User : AggregateRoot<UserId>,IAuditable , ISoftDeletable
{

    public string IdentityId { get; private set; }
    /*Personal Information*/
    public FullName FullName { get; private set; }

    public Email Email { get; private set; }

    public UserStatus Status { get; private set; }

    public bool IsActive => Status == UserStatus.Active;
    /*Auditable and SoftDeletable Section*/
    public DateTimeOffset CreatedOnUtc { get; private set; }
    public DateTimeOffset? UpdatedOnUtc { get;private set; }
    public bool IsDeleted { get; private set;}
    public DateTimeOffset? DeletedOnUtc { get; private set;}
    
    /*Roles and permissiosn*/
    private readonly List<Role> _roles = [];
    public IReadOnlyCollection<Role> Roles => _roles.ToList();
    private User() { }

    private User(
        UserId id,
        string identityId,
        FullName fullname,
        Email email,
        Role role
    ): base(id)
    {
        IdentityId = identityId;
        FullName = fullname;
        Email = email;
        CreatedOnUtc = DateTimeOffset.UtcNow;
        Status = UserStatus.Active;
        _roles.Add(role);
    }

    public static ErrorOr<User> Create(
        string identityId,
        FullName fullname,
        Email email,
        Role role
        )
    {
        return new User(UserId.New(), identityId, fullname, email, role);
    }

    public ErrorOr<Success> Activate()
    {
        if (IsActive)
        {
            return UserErrors.AlreadyActive;
        }

        Status = UserStatus.Active;
        UpdatedOnUtc = DateTimeOffset.UtcNow;

        return Result.Success;
    }
    public ErrorOr<Success> Deactivate()
    {
        if (!IsActive)
        {
            return UserErrors.AlreadyInactive;
        }

        Status = UserStatus.Inactive;
        UpdatedOnUtc = DateTimeOffset.UtcNow;
        

        return Result.Success;
    }
    public ErrorOr<Success> ChangeEmail(Email newEmail)
    {
        if (Email == newEmail)
        {
            return UserErrors.SameEmail;
        }

        var oldEmail = Email.Value;
        Email = newEmail;
        UpdatedOnUtc = DateTimeOffset.UtcNow;
        
        return Result.Success;
    }
    
    public ErrorOr<Success> AddRole(Role role)
    {
        if (Role.IsValid(role.Name))
        {
            return Error.Validation("User.InvalidRole", "The specified role is not valid.");
        }

        if (_roles.Contains(role))
        {
            return Result.Success;
        }

        _roles.Add(role);
        UpdatedOnUtc = DateTimeOffset.UtcNow;

        return Result.Success;
    }
}