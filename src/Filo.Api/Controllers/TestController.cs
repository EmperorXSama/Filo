using Microsoft.AspNetCore.Mvc;

namespace Filo.Api.Controllers;

[ApiController]
[Route("api/test")]
public class TestController : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Test()
    {
        return Ok(new
        {
            message = "Test Message"
        });
    }
}