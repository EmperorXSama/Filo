namespace Filo.Domain.Users;

public sealed class Permissions
{
    private Permissions(){}

    private Permissions(string code)
    {
        Code = code;}
    public string Code { get; private set; }
    public static readonly Permissions CreateSpaces = new("space:create");
    public static readonly Permissions ReadAllSpaces = new("space:read.all");
    public static readonly Permissions ReadSpaces = new("space:read");
    public static readonly Permissions UploadFiles= new("file:upload");
    public static readonly Permissions UploadDownload= new("file:download");

}