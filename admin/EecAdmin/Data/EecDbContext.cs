using Microsoft.EntityFrameworkCore;

namespace EecAdmin.Data;

public class EecDbContext(DbContextOptions<EecDbContext> options) : DbContext(options)
{
    public DbSet<NewsArticle> News => Set<NewsArticle>();
    public DbSet<UpcomingEvent> Events => Set<UpcomingEvent>();
    public DbSet<SiteSettings> Settings => Set<SiteSettings>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<NewsArticle>(e =>
        {
            e.HasIndex(n => n.Slug).IsUnique();
            e.Property(n => n.Body).HasColumnType("TEXT");
        });
    }
}
