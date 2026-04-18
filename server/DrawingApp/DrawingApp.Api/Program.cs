using DrawingApp.Providers;
using Microsoft.SemanticKernel;

namespace DrawingApp.Api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // --- 1. Services Registration ---

            // Configure Semantic Kernel with Google Gemini AI
            builder.Services.AddTransient(sp =>
            {
                // Set a 1-minute timeout for AI model responses
                var httpClient = new HttpClient { Timeout = TimeSpan.FromMinutes(1) };

                return Kernel.CreateBuilder()
                    .AddGoogleAIGeminiChatCompletion(
                        modelId: "gemini-2.5-flash",
                        apiKey: builder.Configuration["GeminiSettings:ApiKey"]!,
                        httpClient: httpClient)
                    .Build();
            });

            // Register Application Providers for Dependency Injection
            // DrawingProvider handles the core logic for the drawing application
            builder.Services.AddHttpClient<DrawingProvider>();
            builder.Services.AddScoped<DrawingProvider>();

            // Configure Cross-Origin Resource Sharing (CORS)
            // Allows the React frontend (running on port 3000) to communicate with this API
            builder.Services.AddCors(options =>
            {
                options.AddDefaultPolicy(policy =>
                {
                    policy.WithOrigins("http://localhost:3000")
                          .AllowAnyHeader()
                          .AllowAnyMethod();
                });
            });

            // Add support for Web Controllers
            builder.Services.AddControllers();

            // Configure Swagger/OpenAPI for API documentation and testing
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // --- 2. Middleware Configuration ---

            // Enable Swagger UI only in Development environment
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            // Apply CORS policy before Authentication/Authorization
            app.UseCors();

            // Standard ASP.NET Core security and routing middleware
          //  app.UseHttpsRedirection();
            app.UseAuthorization();

            // Map incoming HTTP requests to Controller actions
            app.MapControllers();

            // Start the application
            app.Run();
        }
    }
}