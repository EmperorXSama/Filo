using Bogus;
using Filo.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace Filo.Infrastructure.Database.Seeders;

public sealed class DummyDataSeeder
{
    private const int SeedCount = 10;

    private readonly ApplicationDbContext _context;

    public DummyDataSeeder(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task SeedAsync(CancellationToken ct = default)
    {
        if (await _context.Set<DummyItem>().AnyAsync(ct))
            return;

        var now = DateTimeOffset.UtcNow;

        var faker = new Faker<DummyItem>()
            .CustomInstantiator(f => new DummyItem(
                Guid.NewGuid(),
                f.Commerce.ProductName(),
                f.Lorem.Sentence(),
                f.Random.Bool(0.8f)
            ))
            .RuleFor(d => d.CreatedOnUtc, _ => now)
            .RuleFor(d => d.UpdatedOnUtc, (_, d) => d.CreatedOnUtc);

        var items = faker.Generate(SeedCount);

        _context.Set<DummyItem>().AddRange(items);
        await _context.SaveChangesAsync(ct);
    }
}
