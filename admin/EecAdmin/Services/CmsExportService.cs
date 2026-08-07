using System.Text;
using System.Text.Encodings.Web;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;
using EecAdmin.Data;
using Microsoft.EntityFrameworkCore;

namespace EecAdmin.Services;

/// <summary>
/// Writes web-astro/src/data/news-cms.json in the exact TS-compatible shape:
/// { news: [...], leadSlug, sideSlugs, upcoming: [...] }.
/// </summary>
public class CmsExportService(IDbContextFactory<EecDbContext> dbFactory, IConfiguration config)
{
    private static readonly JsonSerializerOptions JsonOpts = new()
    {
        WriteIndented = true,
        Encoder = JavaScriptEncoder.UnsafeRelaxedJsonEscaping,
        DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull,
    };

    public string WebAstroPath => config["Publish:WebAstroPath"]
        ?? throw new InvalidOperationException("Publish:WebAstroPath is not configured.");

    public string ExportPath => Path.Combine(WebAstroPath, "src", "data", "news-cms.json");

    /// <summary>Writes the export file; returns the full path written.</summary>
    public string WriteExport(bool includeDrafts)
    {
        using var db = dbFactory.CreateDbContext();

        var articles = db.News.AsNoTracking()
            .OrderBy(n => n.Position).ThenBy(n => n.Id)
            .ToList();
        if (!includeDrafts)
            articles = articles.Where(a => a.IsPublished).ToList();

        var events = db.Events.AsNoTracking()
            .OrderBy(e => e.Position).ThenBy(e => e.Id)
            .ToList();

        var settings = db.Settings.AsNoTracking().FirstOrDefault() ?? new SiteSettings();

        var root = new ExportRoot
        {
            News = articles.Select(ToExportArticle).ToList(),
            LeadSlug = settings.LeadSlug,
            SideSlugs = [settings.Side1Slug, settings.Side2Slug],
            Upcoming = events.Select(e => new ExportEvent
            {
                D = e.Day,
                M = e.MonthLabel,
                T = e.Title,
                S = e.Subtitle,
                When = e.WhenLabel,
                Start = e.StartLocal,
                End = e.EndLocal,
                Loc = e.Location,
            }).ToList(),
        };

        var json = JsonSerializer.Serialize(root, JsonOpts);
        Directory.CreateDirectory(Path.GetDirectoryName(ExportPath)!);
        File.WriteAllText(ExportPath, json + "\n", new UTF8Encoding(encoderShouldEmitUTF8Identifier: false));
        return ExportPath;
    }

    private static ExportArticle ToExportArticle(NewsArticle a) => new()
    {
        Slug = a.Slug,
        Tag = a.Tag,
        Title = a.Title,
        Date = a.DateIso,
        DateLabel = a.DateLabel,
        Image = NullIfEmpty(a.Image),
        ObjectPosition = NullIfEmpty(a.ObjectPosition),
        Tone = NullIfEmpty(a.Tone),
        Icon = NullIfEmpty(a.Icon),
        Gallery = ParseGallery(a.GalleryJson),
        Excerpt = a.Excerpt,
        Body = SplitParagraphs(a.Body),
    };

    private static string? NullIfEmpty(string? s) => string.IsNullOrWhiteSpace(s) ? null : s;

    /// <summary>Blank line = paragraph separator.</summary>
    internal static string[] SplitParagraphs(string body) =>
        Regex.Split(body.Replace("\r\n", "\n"), @"\n\s*\n")
            .Select(p => p.Trim())
            .Where(p => p.Length > 0)
            .ToArray();

    private static string[]? ParseGallery(string? galleryJson)
    {
        if (string.IsNullOrWhiteSpace(galleryJson)) return null;
        try
        {
            var items = JsonSerializer.Deserialize<string[]>(galleryJson);
            return items is { Length: > 0 } ? items : null;
        }
        catch (JsonException)
        {
            return null;
        }
    }

    private sealed class ExportRoot
    {
        [JsonPropertyName("news")] public List<ExportArticle> News { get; set; } = [];
        [JsonPropertyName("leadSlug")] public string LeadSlug { get; set; } = "";
        [JsonPropertyName("sideSlugs")] public List<string> SideSlugs { get; set; } = [];
        [JsonPropertyName("upcoming")] public List<ExportEvent> Upcoming { get; set; } = [];
    }

    private sealed class ExportArticle
    {
        [JsonPropertyName("slug")] public string Slug { get; set; } = "";
        [JsonPropertyName("tag")] public string Tag { get; set; } = "";
        [JsonPropertyName("title")] public string Title { get; set; } = "";
        [JsonPropertyName("date")] public string Date { get; set; } = "";
        [JsonPropertyName("dateLabel")] public string DateLabel { get; set; } = "";
        [JsonPropertyName("image")] public string? Image { get; set; }
        [JsonPropertyName("objectPosition")] public string? ObjectPosition { get; set; }
        [JsonPropertyName("tone")] public string? Tone { get; set; }
        [JsonPropertyName("icon")] public string? Icon { get; set; }
        [JsonPropertyName("gallery")] public string[]? Gallery { get; set; }
        [JsonPropertyName("excerpt")] public string Excerpt { get; set; } = "";
        [JsonPropertyName("body")] public string[] Body { get; set; } = [];
    }

    private sealed class ExportEvent
    {
        [JsonPropertyName("d")] public string D { get; set; } = "";
        [JsonPropertyName("m")] public string M { get; set; } = "";
        [JsonPropertyName("t")] public string T { get; set; } = "";
        [JsonPropertyName("s")] public string S { get; set; } = "";
        [JsonPropertyName("when")] public string When { get; set; } = "";
        [JsonPropertyName("start")] public string Start { get; set; } = "";
        [JsonPropertyName("end")] public string End { get; set; } = "";
        [JsonPropertyName("loc")] public string Loc { get; set; } = "";
    }
}
