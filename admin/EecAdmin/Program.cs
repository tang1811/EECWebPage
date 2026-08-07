using System.Security.Claims;
using EecAdmin.Components;
using EecAdmin.Data;
using EecAdmin.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;

// ---------------------------------------------------------------------------
// Headless CLI mode: `dotnet run -- preview` / `dotnet run -- publish`
// runs the pipeline, prints the log, exits non-zero on failure.
// ---------------------------------------------------------------------------
if (args.Length > 0 && args[0] is "preview" or "publish")
{
    try { Console.OutputEncoding = System.Text.Encoding.UTF8; } catch { /* non-console host */ }

    var cliConfig = new ConfigurationBuilder()
        .SetBasePath(AppPaths.ProjectRoot())
        .AddJsonFile("appsettings.json", optional: false)
        .AddEnvironmentVariables()
        .Build();

    var services = new ServiceCollection();
    services.AddSingleton<IConfiguration>(cliConfig);
    services.AddDbContextFactory<EecDbContext>(o => o.UseSqlite($"Data Source={AppPaths.DbPath()}"));
    services.AddSingleton<CmsExportService>();
    services.AddSingleton<PublishService>();
    await using var provider = services.BuildServiceProvider();

    var factory = provider.GetRequiredService<IDbContextFactory<EecDbContext>>();
    using (var db = factory.CreateDbContext())
    {
        db.Database.EnsureCreated();
        SeedData.EnsureSeeded(db);
    }

    var publisher = provider.GetRequiredService<PublishService>();
    var result = args[0] == "preview"
        ? await publisher.PreviewAsync()
        : await publisher.PublishLiveAsync();

    Console.WriteLine(result.Log);
    Console.WriteLine(result.Success ? "RESULT: SUCCESS" : "RESULT: FAILED");
    return result.Success ? 0 : 1;
}

// ---------------------------------------------------------------------------
// Web host (admin on :5080, static preview on :5081 — see appsettings Kestrel).
// ---------------------------------------------------------------------------
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

builder.Services.AddDbContextFactory<EecDbContext>(o => o.UseSqlite($"Data Source={AppPaths.DbPath()}"));
builder.Services.AddSingleton<CmsExportService>();
builder.Services.AddSingleton<PublishService>();

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/login";
        options.ExpireTimeSpan = TimeSpan.FromHours(12);
        options.SlidingExpiration = true;
    });
builder.Services.AddAuthorization();
builder.Services.AddCascadingAuthenticationState();

var app = builder.Build();

// Create DB + seed on first run.
using (var scope = app.Services.CreateScope())
{
    var factory = scope.ServiceProvider.GetRequiredService<IDbContextFactory<EecDbContext>>();
    using var db = factory.CreateDbContext();
    db.Database.EnsureCreated();
    SeedData.EnsureSeeded(db);
}

// ---------------------------------------------------------------------------
// Port 5081: static preview host for web-astro/dist-preview (no auth).
// index.html default docs so /news/ resolves to /news/index.html.
// ---------------------------------------------------------------------------
var webAstroPath = app.Configuration["Publish:WebAstroPath"]
    ?? throw new InvalidOperationException("Publish:WebAstroPath is not configured.");
var previewRoot = Path.Combine(webAstroPath, "dist-preview");
Directory.CreateDirectory(previewRoot); // PhysicalFileProvider needs an existing dir; 404s until built
var previewProvider = new PhysicalFileProvider(previewRoot);

app.MapWhen(ctx => ctx.Connection.LocalPort == 5081, preview =>
{
    // WebApplication's implicit UseRouting has already picked a Blazor endpoint
    // for this request; StaticFileMiddleware refuses to serve while an endpoint
    // is set, so clear it for the preview branch.
    preview.Use((ctx, next) =>
    {
        ctx.SetEndpoint(null);
        return next();
    });
    preview.UseDefaultFiles(new DefaultFilesOptions
    {
        FileProvider = previewProvider,
        DefaultFileNames = ["index.html"],
    });
    preview.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = previewProvider,
        ServeUnknownFileTypes = true,
    });
    preview.Run(ctx =>
    {
        ctx.Response.StatusCode = StatusCodes.Status404NotFound;
        return ctx.Response.WriteAsync("preview not built yet");
    });
    // No terminal middleware: anything unmatched returns 404 (fine before first build).
});

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
}
app.UseStatusCodePagesWithReExecute("/not-found", createScopeForStatusCodePages: true);

app.UseAuthentication();
app.UseAuthorization();
app.UseAntiforgery();

app.MapStaticAssets();

// Cookie sign-in/out endpoints (login form posts here).
app.MapPost("/auth/login", async (HttpContext ctx, IConfiguration config) =>
{
    var form = await ctx.Request.ReadFormAsync();
    var password = form["password"].ToString();
    var expected = config["Admin:Password"];
    if (!string.IsNullOrEmpty(expected) && password == expected)
    {
        var identity = new ClaimsIdentity(
            [new Claim(ClaimTypes.Name, "admin")],
            CookieAuthenticationDefaults.AuthenticationScheme);
        await ctx.SignInAsync(
            CookieAuthenticationDefaults.AuthenticationScheme,
            new ClaimsPrincipal(identity));
        return Results.Redirect("/");
    }
    return Results.Redirect("/login?error=1");
}).AllowAnonymous().DisableAntiforgery();

app.MapGet("/auth/logout", async (HttpContext ctx) =>
{
    await ctx.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
    return Results.Redirect("/login");
}).AllowAnonymous();

app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode()
    .RequireAuthorization();

app.Run();
return 0;
