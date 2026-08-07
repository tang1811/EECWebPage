namespace EecAdmin.Services;

public static class AppPaths
{
    /// <summary>
    /// Resolves the EecAdmin project root (the directory containing EecAdmin.csproj)
    /// by walking up from the build output directory. Works for both
    /// `dotnet run` and running the compiled binary from bin/.
    /// </summary>
    public static string ProjectRoot()
    {
        var dir = new DirectoryInfo(AppContext.BaseDirectory);
        while (dir is not null)
        {
            if (File.Exists(Path.Combine(dir.FullName, "EecAdmin.csproj")))
                return dir.FullName;
            dir = dir.Parent!;
        }
        return Directory.GetCurrentDirectory();
    }

    /// <summary>admin/EecAdmin/data/eec-admin.db (directory created on demand).</summary>
    public static string DbPath()
    {
        var dataDir = Path.Combine(ProjectRoot(), "data");
        Directory.CreateDirectory(dataDir);
        return Path.Combine(dataDir, "eec-admin.db");
    }
}
