// Filo.Application/Common/Models/PagedList.cs
namespace Filo.Application.Common.Models;

public class PagedList<T>
{
    public IEnumerable<T> Items { get; set; } = [];
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
    public int TotalCount { get; set; }

    public int TotalPages => (int)Math.Ceiling(TotalCount / (double)PageSize);
    public bool HasPreviousPage => PageNumber > 1;
    public bool HasNextPage => PageNumber < TotalPages;

    public PagedList() { }

    public PagedList(IEnumerable<T> items, int pageNumber, int pageSize, int totalCount)
    {
        Items = items;
        PageNumber = pageNumber;
        PageSize = pageSize;
        TotalCount = totalCount;
    }

    public PagedList<TTarget> Map<TTarget>(Func<T, TTarget> selector)
    {
        return new PagedList<TTarget>(
            Items.Select(selector).ToList(),
            PageNumber,
            PageSize,
            TotalCount
        );
    }
}