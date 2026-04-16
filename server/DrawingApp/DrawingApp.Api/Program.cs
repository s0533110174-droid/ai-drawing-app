

using DrawingApp.Providers;
using Microsoft.SemanticKernel;

namespace DrawingApp.Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddTransient(sp =>
            {
                var httpClient = new HttpClient { Timeout = TimeSpan.FromMinutes(1) };

                return Kernel.CreateBuilder()
                    .AddGoogleAIGeminiChatCompletion(
                        modelId: "gemini-2.5-flash",
                        apiKey: builder.Configuration["GeminiSettings:ApiKey"]!,
                        httpClient: httpClient) // הזרקת ה-Client המוגדר
                    .Build();
            });
            // --- 1. Services Registration ---

            // Register our Provider for Dependency Injection
            // This allows the Controllers to use the DrawingProvider
            builder.Services.AddHttpClient<DrawingProvider>();
            builder.Services.AddScoped<DrawingProvider>();

            // Configure CORS for React (usually runs on port 5173 or 3000)
            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowReact", policy =>
                {
                    policy.AllowAnyOrigin()
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });

            builder.Services.AddControllers();

            // Swagger setup for API testing
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // --- 2. Middleware Configuration ---

            // Enable Swagger in Development mode
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // Apply CORS policy
            app.UseCors("AllowReact");

         app.UseHttpsRedirection();
            app.UseAuthorization();

            // Map Controller routes
            app.MapControllers();

            app.Run();
        }
    }
}