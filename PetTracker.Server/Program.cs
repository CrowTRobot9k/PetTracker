using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;
using PetTracker.Domain.Models;
using PetTracker.Infrastucture.Services;
using PetTracker.Server.Models;
using PetTracker.SqlDb.Models;
using Scalar.AspNetCore;
using System.Security.Claims;

try
{
    var builder = WebApplication.CreateBuilder(args);

    // =============================================================================
    // DATABASE CONFIGURATION
    // =============================================================================
    
    var connectionString = builder.Configuration.GetConnectionString("PtDbConnection") 
        ?? throw new InvalidOperationException("Connection string 'PtDbConnection' not found.");

    builder.Services.AddDbContext<PtDbContext>(options =>
    {
        options.UseSqlServer(connectionString, b => b.MigrationsAssembly("PetTracker.Server"));
        options.EnableDetailedErrors();
    });

    builder.Services.AddTransient<IPtDbContext, PtDbContext>();

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
    // APPLICATION SERVICES
    // =============================================================================
    
    // Email Services
    builder.Services.AddScoped<IEmailSender<AspNetUser>, IdentityEmailSender>();
    builder.Services.AddScoped<ICustomEmailSender, IdentityEmailSender>();
    
    // Business Services
    builder.Services.AddScoped<IImageCompressionService, ImageCompressionService>();
    builder.Services.AddScoped<IFileUploadService, FileUploadService>();
    builder.Services.AddScoped<IPetService, PetService>();
    builder.Services.AddScoped<IOwnerService, OwnerService>();
    builder.Services.AddScoped<IAppointmentService, AppointmentService>();
    builder.Services.AddScoped<IUserService, UserService>();
    builder.Services.AddScoped<ICompanyService, CompanyService>();

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

    app.MapGet("/getauth", (ClaimsPrincipal claimsPrincipal) =>
    {
        var email = claimsPrincipal.FindFirstValue(ClaimTypes.Email);
        var userName = claimsPrincipal.FindFirstValue(ClaimTypes.Name);

        return Results.Json(new { Email = email, UserName = userName });
    }).RequireAuthorization();

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
