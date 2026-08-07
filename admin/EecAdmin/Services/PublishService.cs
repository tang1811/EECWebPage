using System.Diagnostics;
using System.Text;

namespace EecAdmin.Services;

public record PipelineResult(bool Success, string Log);

/// <summary>
/// Runs the export → npm build → (copy to live share) pipelines.
/// Preview builds to web-astro/dist-preview with PUBLIC_PREVIEW=1;
/// live publish builds dist/ and copies it over the IIS share
/// (overwrite only — never deletes anything already in the share).
/// </summary>
public class PublishService(CmsExportService export, IConfiguration config)
{
    private string WebAstroPath => config["Publish:WebAstroPath"]
        ?? throw new InvalidOperationException("Publish:WebAstroPath is not configured.");

    private string LiveSharePath => config["Publish:LiveSharePath"]
        ?? throw new InvalidOperationException("Publish:LiveSharePath is not configured.");

    public async Task<PipelineResult> PreviewAsync()
    {
        var log = new StringBuilder();
        try
        {
            var path = export.WriteExport(includeDrafts: true);
            log.AppendLine($"[export] wrote {path} (including drafts)");

            var (exitCode, npmLog) = await RunNpmAsync(
                "npm run build -- --outDir dist-preview",
                new Dictionary<string, string> { ["PUBLIC_PREVIEW"] = "1" });
            log.Append(npmLog);

            if (exitCode != 0)
            {
                log.AppendLine($"[build] FAILED (exit code {exitCode})");
                return new PipelineResult(false, log.ToString());
            }

            log.AppendLine("[build] preview build OK -> dist-preview");
            log.AppendLine("[preview] open http://localhost:5081/");
            return new PipelineResult(true, log.ToString());
        }
        catch (Exception ex)
        {
            log.AppendLine($"[error] {ex.Message}");
            return new PipelineResult(false, log.ToString());
        }
    }

    public async Task<PipelineResult> PublishLiveAsync()
    {
        var log = new StringBuilder();
        try
        {
            var path = export.WriteExport(includeDrafts: false);
            log.AppendLine($"[export] wrote {path} (published only)");

            var (exitCode, npmLog) = await RunNpmAsync("npm run build", env: null);
            log.Append(npmLog);

            if (exitCode != 0)
            {
                log.AppendLine($"[build] FAILED (exit code {exitCode})");
                return new PipelineResult(false, log.ToString());
            }
            log.AppendLine("[build] production build OK -> dist");

            var distDir = Path.Combine(WebAstroPath, "dist");
            if (!Directory.Exists(distDir))
            {
                log.AppendLine($"[copy] FAILED: {distDir} does not exist");
                return new PipelineResult(false, log.ToString());
            }

            var copied = CopyOver(distDir, LiveSharePath);
            log.AppendLine($"[copy] copied {copied} files from dist/ over {LiveSharePath} (no deletions)");
            log.AppendLine("[publish] DONE");
            return new PipelineResult(true, log.ToString());
        }
        catch (Exception ex)
        {
            log.AppendLine($"[error] {ex.Message}");
            return new PipelineResult(false, log.ToString());
        }
    }

    private async Task<(int ExitCode, string Log)> RunNpmAsync(string command, IDictionary<string, string>? env)
    {
        var log = new StringBuilder();
        log.AppendLine($"[build] cmd.exe /c \"{command}\" (cwd={WebAstroPath})");

        var psi = new ProcessStartInfo
        {
            FileName = "cmd.exe",
            Arguments = $"/c \"{command}\"",
            WorkingDirectory = WebAstroPath,
            RedirectStandardOutput = true,
            RedirectStandardError = true,
            UseShellExecute = false,
            CreateNoWindow = true,
            StandardOutputEncoding = Encoding.UTF8,
            StandardErrorEncoding = Encoding.UTF8,
        };
        if (env is not null)
            foreach (var (key, value) in env)
                psi.Environment[key] = value;

        using var process = new Process { StartInfo = psi };
        var output = new StringBuilder();
        var sync = new object();
        process.OutputDataReceived += (_, e) => { if (e.Data is not null) lock (sync) output.AppendLine(e.Data); };
        process.ErrorDataReceived += (_, e) => { if (e.Data is not null) lock (sync) output.AppendLine(e.Data); };

        process.Start();
        process.BeginOutputReadLine();
        process.BeginErrorReadLine();
        await process.WaitForExitAsync();

        lock (sync) log.Append(output);
        return (process.ExitCode, log.ToString());
    }

    /// <summary>Recursive overwrite-copy. Creates directories, never deletes.</summary>
    private static int CopyOver(string sourceDir, string targetDir)
    {
        Directory.CreateDirectory(targetDir);
        var count = 0;
        foreach (var file in Directory.GetFiles(sourceDir))
        {
            File.Copy(file, Path.Combine(targetDir, Path.GetFileName(file)), overwrite: true);
            count++;
        }
        foreach (var dir in Directory.GetDirectories(sourceDir))
            count += CopyOver(dir, Path.Combine(targetDir, Path.GetFileName(dir)));
        return count;
    }
}
