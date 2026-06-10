using System.Reflection;

namespace Filo.Application;

public  static class AssemblyReference
{
    public static readonly Assembly ApplicationAssembly = typeof(AssemblyReference).Assembly;
}