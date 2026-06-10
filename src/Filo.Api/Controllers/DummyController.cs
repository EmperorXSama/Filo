using ErrorOr;
using Filo.Application.Features.Dummies.Commands.CreateDummyItem;
using Filo.Application.Features.Dummies.Commands.DeleteDummyItem;
using Filo.Application.Features.Dummies.Commands.UpdateDummyItem;
using Filo.Application.Features.Dummies.Dtos;
using Filo.Application.Features.Dummies.Queries.GetDummyItem;
using Filo.Application.Features.Dummies.Queries.GetDummyItems;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace Filo.Api.Controllers;

[ApiController]
[Route("api/dummies")]
public sealed class DummyController(ISender sender) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> Get(CancellationToken ct)
    {
        var result = await sender.Send(new GetDummyItemsQuery(), ct);
        return result.Match<IActionResult>(Ok, ToProblem);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var result = await sender.Send(new GetDummyItemQuery(id), ct);
        return result.Match<IActionResult>(Ok, ToProblem);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateDummyItemCommand command, CancellationToken ct)
    {
        var result = await sender.Send(command, ct);
        return result.Match(
            response => CreatedAtAction(nameof(GetById), new { id = response.Id }, response),
            ToProblem
        );
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateDummyItemCommand command, CancellationToken ct)
    {
        if (id != command.Id)
            return BadRequest("Route id and command id must match.");

        var result = await sender.Send(command, ct);
        return result.Match<IActionResult>(Ok, ToProblem);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var result = await sender.Send(new DeleteDummyItemCommand(id), ct);
        return result.Match(_ => NoContent(), ToProblem);
    }

    private IActionResult ToProblem(List<Error> errors) => BadRequest(errors);
}
