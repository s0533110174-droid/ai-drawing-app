using DrawingApp.DM;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.SemanticKernel;
using Microsoft.SemanticKernel.Connectors.Google;
using System.Text.Json;

namespace DrawingApp.Providers
{
    /**
     * DrawingProvider Service
     * -----------------------
     * This service handles the communication with AI models (Gemini or GPT).
     * It transforms user prompts into structured JSON data for canvas rendering.
     */
    public class DrawingProvider
    {
        private readonly HttpClient _httpClient;
        private readonly Kernel _kernel;
        private readonly string _apiKey;
        private readonly string _apiUrl;

        public DrawingProvider(HttpClient httpClient, IConfiguration configuration, Kernel kernel)
        {
            _httpClient = httpClient;
            _kernel = kernel ?? throw new ArgumentNullException(nameof(kernel));

            // Getting settings from appsettings.json
            // Make sure to update these keys in your JSON file
            _apiKey = configuration["AiSettings:ApiKey"] ?? "";
            _apiUrl = configuration["AiSettings:ApiUrl"] ?? "";
        }

        /**
         * Sends a natural language prompt to the AI and returns a JSON string 
         * containing shape definitions (type, color, etc.).
         * * @param prompt - The user's drawing request (e.g., "draw a red circle").
         * @returns A sanitized JSON string for the frontend.
         */
        public async Task<string> GenerateAiDrawingAsync(string userPrompt)
        {
            try
            {


                //            // Define the AI's behavior and the expected JSON schema
                //            const string systemPrompt = @"
                //        You are a Canvas Drawing Engine. Convert user requests into drawing commands.
                //        Canvas size is 800x600.
                //        Output ONLY valid JSON in this format:
                //        {
                //            ""Summary"": ""A brief description of what you drew"",
                //            ""Commands"": [
                //                { ""Type"": ""rect"", ""X"": 50, ""Y"": 50, ""Width"": 100, ""Height"": 100, ""Color"": ""red"" },
                //                { ""Type"": ""line"", ""X"": 10, ""Y"": 10, ""ToX"": 100, ""ToY"": 100, ""Color"": ""blue"" }
                //            ]
                //        }";

                //            var settings = new GeminiPromptExecutionSettings
                //            {
                //                ResponseMimeType = "application/json",
                //                // Adding a schema description helps the API validate the request
                //                ResponseSchema = @"{
                //    ""type"": ""object"",
                //    ""properties"": {
                //        ""Summary"": { ""type"": ""string"" },
                //        ""Commands"": { 
                //            ""type"": ""array"",
                //            ""items"": { ""type"": ""object"" }
                //        }
                //    }
                //}"
                //            };

                //            var result = await _kernel.InvokePromptAsync(
                //            $"{systemPrompt}\n\nUser Request: {userRequest}",
                //            new KernelArguments(settings)
                //        );

                //            return result.ToString();


                var settings = new GeminiPromptExecutionSettings
                {
                    ResponseMimeType = "application/json",
                    ResponseSchema = typeof(DrawingResponse), // הכרחי ל-Gemini 2.5
                    Temperature = 0.1f
                };

                const string systemInstruction = @"
        You are a drawing assistant. You must return ONLY a JSON object with a property named 'shapes' which is an array of objects.
        Each object in the array MUST follow this format:
        {
            ""type"": ""rect"" or ""circle"" or ""line"",
            ""x"": 150,
            ""y"": 200,
            ""color"": ""blue"",
            ""radius"": 50,
            ""width"": 100,
            ""height"": 100,
            ""toX"": 300,
            ""toY"": 400
        }
        Coordinates: 800x600. Output ONLY the JSON.";

                var prompt = $"""
            Instructions: {systemInstruction}
            User request: {userPrompt}
            """;

                var result = await _kernel.InvokePromptAsync(prompt, new KernelArguments(settings));
                return result.ToString();
            }
            catch (Exception ex)
            {
                // Logs the exception to the Visual Studio Output window
                Console.WriteLine($"[Critical DrawingProvider Error] {ex.Message}");

                // Fallback shape to prevent frontend crash on white canvas
                return "{\"shapes\": [\"rect\"], \"color\": \"red\"}";
            }
        }
    }
}