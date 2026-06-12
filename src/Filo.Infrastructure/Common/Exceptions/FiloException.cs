namespace Filo.Infrastructure.Common.Exceptions;

public class FiloException : Exception
{
    public FiloException(string message) : base(message) { }

    public FiloException(string name, object key) : base($"{name} ({key})") { }
}
