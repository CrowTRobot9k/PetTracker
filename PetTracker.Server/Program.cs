//using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Hosting.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using PetTracker.Domain.Models;
using PetTracker.Server.Models;
using PetTracker.SqlDb.Models;
using Scalar.AspNetCore;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

var connectionString = builder.Configuration.GetConnectionString("PtDbConnection") ?? throw new InvalidOperationException("Connection string 'PtDbConnection' not found.");

builder.Services.AddDbContext<PtDbContext>(options =>
{
    options.UseSqlServer(connectionString, b => b.MigrationsAssembly("PetTracker.Server"));
    options.EnableDetailedErrors();
});

builder.Services.AddDefaultIdentity<AspNetUser>(options => options.SignIn.RequireConfirmedAccount = true).AddEntityFrameworkStores<PtDbContext>();

builder.Services.AddCors(options => options.AddPolicy("CorsPolicy",
    builder =>
    {
        builder
        .AllowAnyOrigin()
        .AllowAnyMethod()
        .AllowAnyHeader();
       // .AllowCredentials();
    }));

builder.Services.AddAuthorization();

builder.Services.AddIdentityCore<AspNetUser>().AddEntityFrameworkStores<PtDbContext>();

// Add services to the container.
builder.Services.AddTransient<IPtDbContext, PtDbContext>();
builder.Services.AddScoped<IEmailSender<AspNetUser>, IdentityEmailSender>();
//builder.Services.AddScoped<IEmailSender, EmailSender>();

builder.Services.AddControllers();
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();
//app.MapIdentityApi<AspNetUser>();
app.MapCustomizedIdentityApi<AspNetUser>();
app.MapStaticAssets();

app.MapPost("/logout", async (SignInManager<AspNetUser> signInManager) =>
{

    await signInManager.SignOutAsync();
    return Results.Ok();

}).RequireAuthorization();


app.MapGet("/getauth", (ClaimsPrincipal claimsP) =>
{
    var email = claimsP.FindFirstValue(ClaimTypes.Email); // get the user's email from the claim
    var userName = claimsP.FindFirstValue(ClaimTypes.Name);

    return Results.Json(new { Email = email, UserName = userName  }); ; // return the email as a plain text response
}).RequireAuthorization();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");
app.UseCors();
app.Run();
