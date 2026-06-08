using System.Diagnostics;
using System.Reflection;
using System.Runtime.InteropServices;
using Microsoft.AspNetCore.Mvc;

namespace Filo.Api.Controllers;

[ApiController]
[Route("api/system-info")]
public class SystemInfoController : ControllerBase
{
    private readonly IHostEnvironment _environment;

    public SystemInfoController(IHostEnvironment environment)
    {
        _environment = environment;
    }

    [HttpGet]
    public IActionResult Get()
    {
        return Ok(new
        {
            machineName = Environment.MachineName,
            osVersion = Environment.OSVersion.ToString(),
            osArchitecture = RuntimeInformation.OSArchitecture.ToString(),
            processArchitecture = RuntimeInformation.ProcessArchitecture.ToString(),
            runtimeVersion = RuntimeInformation.FrameworkDescription,
            clrVersion = Environment.Version.ToString(),
            runtimeIdentifier = RuntimeInformation.RuntimeIdentifier,
            environment = _environment.EnvironmentName,
            workingDirectory = Environment.CurrentDirectory,
            userName = Environment.UserName,
            userDomainName = Environment.UserDomainName,
            is64BitProcess = Environment.Is64BitProcess,
            processorCount = Environment.ProcessorCount,
            processUptime = DateTime.UtcNow - Process.GetCurrentProcess().StartTime.ToUniversalTime(),
            applicationVersion = Assembly.GetEntryAssembly()?.GetName().Version?.ToString() ?? "unknown",
            userInteractive = Environment.UserInteractive
        });
    }
}
