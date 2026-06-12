namespace Filo.Domain.Users;

public sealed class Role
{
    private Role(){}
    public string Name { get; private set; }
    private Role(string name)
    {
        Name = name;
    }

    public static readonly Role Member = new Role(nameof(Member));
    public static readonly Role Administrator = new Role(nameof(Administrator));

    private static IReadOnlyDictionary<string, Role> _roles = new Dictionary<string, Role>()
    {
        { Member.Name, Member },
        { Administrator.Name, Administrator }
    };

    public static bool IsValid(string roleName)
    {
        return _roles.ContainsKey(roleName);
    }

    public static bool GetFromName(string roleName, out Role? role)
    {
        role = null;
        return _roles.TryGetValue(roleName, out role);
    }

}