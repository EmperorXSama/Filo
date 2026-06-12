using ErrorOr;

namespace Filo.Domain.Users.ValueObjects;

public record FullName
{
    public string FirstName { get; init; }
    public string LastName { get; init; }
    

    private FullName(string firstName, string lastName)
    {
        FirstName = firstName;
        LastName = lastName;
    }

    public static ErrorOr<FullName> Create(
        string firstName,
        string lastName
        )
    {
        var errors = new List<Error>();

        if (string.IsNullOrWhiteSpace(firstName))
            errors.Add(Error.Validation("FullName.EmptyFirstName", "First name cannot be empty."));

        if (firstName.Trim().Length > 100)
            errors.Add(Error.Validation("FullName.FirstNameTooLong", "First name cannot exceed 100 characters."));

        if (string.IsNullOrWhiteSpace(lastName))
            errors.Add(Error.Validation("FullName.EmptyLastName", "Last name cannot be empty."));

        if (lastName.Trim().Length > 100)
            errors.Add(Error.Validation("FullName.LastNameTooLong", "Last name cannot exceed 100 characters."));

        if (errors.Count > 0)
            return errors;

        return new FullName(firstName.Trim(), lastName.Trim());
    }

    public override string ToString()
    {
        return $"{FirstName} {LastName}";
    }
}