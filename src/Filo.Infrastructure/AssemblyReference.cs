using System.Reflection;

namespace Filo.Infrastructure;

public static class AssemblyReference
{
    public static readonly Assembly Infrastructure = typeof(AssemblyReference).Assembly;
}