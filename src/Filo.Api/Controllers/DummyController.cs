using Filo.Api.Extensions;
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
        return result.Match<IActionResult>(Ok, errors => this.ToProblem(errors));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var result = await sender.Send(new GetDummyItemQuery(id), ct);
        return result.Match<IActionResult>(Ok, errors => this.ToProblem(errors));
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateDummyItemCommand command, CancellationToken ct)
    {
        var result = await sender.Send(command, ct);
        return result.Match(
            response => CreatedAtAction(nameof(GetById), new { id = response.Id }, response),
            errors => this.ToProblem(errors)
        );
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, UpdateDummyItemCommand command, CancellationToken ct)
    {
        if (id != command.Id)
            return BadRequest("Route id and command id must match.");

        var result = await sender.Send(command, ct);
        return result.Match<IActionResult>(Ok, errors => this.ToProblem(errors));
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var result = await sender.Send(new DeleteDummyItemCommand(id), ct);
        return result.Match(_ => NoContent(), errors => this.ToProblem(errors));
    }
}
