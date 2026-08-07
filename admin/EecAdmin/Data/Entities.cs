namespace EecAdmin.Data;

/// <summary>
/// News/activity article. Mirrors web-astro/src/data/news-data.ts NewsArticle.
/// Photo articles set Image (+ optional ObjectPosition); announcement-style
/// articles set Tone + Icon and render as tinted icon cards.
/// </summary>
public class NewsArticle
{
    public int Id { get; set; }
    public string Slug { get; set; } = "";
    public string Tag { get; set; } = "";
    public string Title { get; set; } = "";
    /// <summary>ISO date 'yyyy-MM-dd' (for &lt;time&gt; + sorting).</summary>
    public string DateIso { get; set; } = "";
    /// <summary>Thai Buddhist-era display label, e.g. '20 พฤษภาคม 2569'.</summary>
    public string DateLabel { get; set; } = "";
    public string? Image { get; set; }
    public string? ObjectPosition { get; set; }
    /// <summary>green | navy | amber (icon-card articles only).</summary>
    public string? Tone { get; set; }
    /// <summary>book | award | briefcase | shield | users | chip.</summary>
    public string? Icon { get; set; }
    /// <summary>JSON array of extra image paths (nullable).</summary>
    public string? GalleryJson { get; set; }
    public string Excerpt { get; set; } = "";
    /// <summary>Full body text; paragraphs separated by a blank line.</summary>
    public string Body { get; set; } = "";
    public bool IsPublished { get; set; } = true;
    public int Position { get; set; }
}

/// <summary>Upcoming-events calendar row. Mirrors news-data.ts UpcomingEvent.</summary>
public class UpcomingEvent
{
    public int Id { get; set; }
    /// <summary>Day-of-month display, e.g. '14'.</summary>
    public string Day { get; set; } = "";
    /// <summary>Thai month abbrev display, e.g. 'ส.ค.'.</summary>
    public string MonthLabel { get; set; } = "";
    public string Title { get; set; } = "";
    public string Subtitle { get; set; } = "";
    /// <summary>Display time/place line, e.g. '08:00 น. · หอประชุม'.</summary>
    public string WhenLabel { get; set; } = "";
    /// <summary>'yyyy-MM-ddTHH:mm' local (Asia/Bangkok) for .ics.</summary>
    public string StartLocal { get; set; } = "";
    public string EndLocal { get; set; } = "";
    public string Location { get; set; } = "";
    public int Position { get; set; }
}

/// <summary>Single-row settings: /news/ magazine layout lead + side stories.</summary>
public class SiteSettings
{
    public int Id { get; set; }
    public string LeadSlug { get; set; } = "";
    public string Side1Slug { get; set; } = "";
    public string Side2Slug { get; set; } = "";
}
