using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;
using PetTracker.Domain.Models;
using PetTracker.Infrastucture.Services;
using PetTracker.Server.Models;
using PetTracker.Server.HealthChecks;
using PetTracker.SqlDb.Models;
using Scalar.AspNetCore;
using System.Security.Claims;
using System.Linq;
using PetTracker.Domain.DTOs;

try
{
    var builder = WebApplication.CreateBuilder(args);

    // =============================================================================
    // DATABASE CONFIGURATION WITH CONNECTION POOLING
    // =============================================================================
    
    var connectionString = builder.Configuration.GetConnectionString("PtDbConnection") 
        ?? throw new InvalidOperationException("Connection string 'PtDbConnection' not found.");

    // Configure database settings
    var databaseSettings = builder.Configuration.GetSection(DatabaseSettings.SectionName)
        .Get<DatabaseSettings>() ?? new DatabaseSettings();

    builder.Services.Configure<DatabaseSettings>(
        builder.Configuration.GetSection(DatabaseSettings.SectionName));

    // Configure DbContext pooling for improved performance
    builder.Services.AddDbContextPool<PtDbContext>(options =>
    {
        var sqlServerOptions = options.UseSqlServer(connectionString, b => 
        {
            b.MigrationsAssembly("PetTracker.Server");
            
            // Connection pooling configuration
            if (databaseSettings.ConnectionPooling.Enabled)
            {
                b.EnableRetryOnFailure(
                    maxRetryCount: databaseSettings.ConnectionPooling.MaxRetryCount,
                    maxRetryDelay: databaseSettings.ConnectionPooling.MaxRetryDelay,
                    errorNumbersToAdd: null);
            }
            
            // Command timeout
            b.CommandTimeout(databaseSettings.ConnectionPooling.CommandTimeout);
        });

        // Entity Framework configuration
        options.EnableDetailedErrors();
        options.EnableSensitiveDataLogging(builder.Environment.IsDevelopment());
        
        // Configure warnings for better debugging
        if (databaseSettings.ConnectionPooling.Enabled)
        {
            options.ConfigureWarnings(warnings => warnings
                .Log(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.MultipleCollectionIncludeWarning));
        }
    }, poolSize: databaseSettings.ConnectionPooling.DbContextPoolSize);

    // Register the interface for dependency injection
    // DbContext pooling automatically handles the lifetime management
    builder.Services.AddScoped<IPtDbContext, PtDbContext>();

    // =============================================================================
    // IDENTITY CONFIGURATION
    // =============================================================================
    
    builder.Services.AddDefaultIdentity<AspNetUser>(options => 
        options.SignIn.RequireConfirmedAccount = true)
        .AddRoles<AspNetRole>()
        .AddEntityFrameworkStores<PtDbContext>();

    builder.Services.AddAuthorization();

    // =============================================================================
    // CORS CONFIGURATION
    // =============================================================================
    
    builder.Services.AddCors(options => options.AddPolicy("CorsPolicy", policy =>
    {
        policy
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    }));

    // =============================================================================
    // CACHING CONFIGURATION
    // =============================================================================
    
    // Add in-memory caching
    builder.Services.AddMemoryCache(options =>
    {
        options.SizeLimit = 1000; // Maximum number of cache entries
        options.CompactionPercentage = 0.25; // Remove 25% of entries when limit is reached
        options.ExpirationScanFrequency = TimeSpan.FromMinutes(5); // Scan for expired entries every 5 minutes
    });

    // =============================================================================
    // APPLICATION SERVICES
    // =============================================================================
    
    // Email Services
    builder.Services.AddScoped<IEmailSender<AspNetUser>, IdentityEmailSender>();
    builder.Services.AddScoped<ICustomEmailSender, IdentityEmailSender>();
    
    // Business Services
    builder.Services.AddScoped<IImageCompressionService, ImageCompressionService>();
    builder.Services.AddScoped<IFileUploadService, FileUploadService>();
    builder.Services.AddScoped<IPetService, PetService>();
    builder.Services.AddScoped<ICachingService, CachingService>();
    builder.Services.AddScoped<IOwnerService, OwnerService>();
    builder.Services.AddScoped<IAppointmentService, AppointmentService>();
    builder.Services.AddScoped<IUserService, UserService>();
    builder.Services.AddScoped<ICompanyService, CompanyService>();
    builder.Services.AddScoped<IConnectionPoolMonitoringService, ConnectionPoolMonitoringService>();

    // =============================================================================
    // HEALTH CHECKS
    // =============================================================================
    
    builder.Services.AddHealthChecks()
        .AddCheck<ConnectionPoolHealthCheck>("database_connection_pool", tags: new[] { "db", "connection_pool" });

    // =============================================================================
    // API CONFIGURATION
    // =============================================================================
    
    builder.Services.AddControllers();
    builder.Services.AddOpenApi();
    builder.Services.AddHttpContextAccessor();

    // =============================================================================
    // APPLICATION BUILDING
    // =============================================================================
    
    var app = builder.Build();

    // =============================================================================
    // MIDDLEWARE PIPELINE
    // =============================================================================
    
    // Static Files
    app.UseDefaultFiles();
    app.UseStaticFiles();
    app.MapStaticAssets();

    // CORS
    app.UseCors();

    // HTTPS Redirection
    app.UseHttpsRedirection();

    // Authentication & Authorization
    app.UseAuthentication();
    app.UseAuthorization();

    // =============================================================================
    // API ENDPOINTS
    // =============================================================================
    
    // Identity API
    app.MapCustomizedIdentityApi<AspNetUser>();

    // Custom Authentication Endpoints
    app.MapPost("/logout", async (SignInManager<AspNetUser> signInManager) =>
    {
        await signInManager.SignOutAsync();
        return Results.Ok();
    }).RequireAuthorization();

    app.MapGet("/getauth", async (ClaimsPrincipal claimsPrincipal, IUserService userService) =>
    {
        var userId = claimsPrincipal.FindFirstValue(ClaimTypes.NameIdentifier);
        
        if (string.IsNullOrEmpty(userId))
        {
            return Results.Unauthorized();
        }

        var user = await userService.GetUserById(userId);
        
        if (user == null)
        {
            return Results.NotFound();
        }

        // Return user data in the format expected by AuthStore
        return Results.Json(new {
            id = user.Id,
            firstName = user.FirstName,
            lastName = user.LastName,
            fullName = user.FullName,
            userName = user.UserName,
            email = user.Email,
            company = user.Company,
            roleNames = user.Roles?.Select(r => r.Name).ToArray() ?? new string[0],
            roles = user.Roles ?? new List<RoleDto>()
        });
    }).RequireAuthorization();

    // Health Check Endpoints
    app.MapHealthChecks("/health", new Microsoft.AspNetCore.Diagnostics.HealthChecks.HealthCheckOptions
    {
        ResponseWriter = async (context, report) =>
        {
            context.Response.ContentType = "application/json";
            var response = new
            {
                status = report.Status.ToString(),
                checks = report.Entries.Select(entry => new
                {
                    name = entry.Key,
                    status = entry.Value.Status.ToString(),
                    exception = entry.Value.Exception?.Message,
                    duration = entry.Value.Duration.ToString(),
                    tags = entry.Value.Tags
                }),
                totalDuration = report.TotalDuration.ToString()
            };
            await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(response));
        }
    });
    
    app.MapHealthChecks("/health/ready", new Microsoft.AspNetCore.Diagnostics.HealthChecks.HealthCheckOptions
    {
        Predicate = check => check.Tags.Contains("ready"),
        ResponseWriter = async (context, report) =>
        {
            context.Response.ContentType = "application/json";
            var response = new { status = report.Status.ToString() };
            await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(response));
        }
    });
    
    app.MapHealthChecks("/health/live", new Microsoft.AspNetCore.Diagnostics.HealthChecks.HealthCheckOptions
    {
        Predicate = _ => false, // No checks for liveness
        ResponseWriter = async (context, report) =>
        {
            context.Response.ContentType = "application/json";
            var response = new { status = "Healthy" };
            await context.Response.WriteAsync(System.Text.Json.JsonSerializer.Serialize(response));
        }
    });

    // API Controllers
    app.MapControllers();

    // =============================================================================
    // DEVELOPMENT TOOLS
    // =============================================================================
    
    if (app.Environment.IsDevelopment())
    {
        app.MapOpenApi();
        app.MapScalarApiReference();
    }

    // =============================================================================
    // FALLBACK ROUTING
    // =============================================================================
    
    app.MapFallbackToFile("/index.html");

    // =============================================================================
    // APPLICATION STARTUP
    // =============================================================================
    
    app.Run();
}
catch (Exception ex)
{
    Console.WriteLine($"An error occurred during application startup: {ex.Message}");
    throw;
}
