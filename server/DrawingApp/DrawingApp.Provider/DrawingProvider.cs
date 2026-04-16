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
        public async Task<string> GenerateAiDrawingAsync(string userPrompt,string currentShapesJson)
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
        You are an expert AI Drawing Assistant. 
        Your goal is to generate NEW geometric shapes based on a user's request while considering the CURRENT state of the canvas.

        STRICT RULES:
        1. Context Awareness: Analyze the 'Current Canvas State' provided. 
        2. No Overlap: Place new shapes in empty areas of the 800x600 canvas. Do not draw over existing shapes unless explicitly asked.
        3. Output Format: Return ONLY a valid JSON object. No prose, no markdown blocks.
        4. Schema:
        {
            ""shapes"": [
                {
                    ""type"": ""rect"" | ""circle"" | ""line"",
                    ""x"": number,
                    ""y"": number,
                    ""color"": string,
                    ""radius"": number (for circles),
                    ""width"": number (for rects),
                    ""height"": number (for rects),
                    ""toX"": number (for lines),
                    ""toY"": number (for lines)
                }
            ]
        }";

                var prompt = $"""
        SYSTEM INSTRUCTIONS: {systemInstruction}
        
        CURRENT CANVAS STATE (JSON): 
        {currentShapesJson}

        USER REQUEST: 
        {userPrompt}
        
        Generate only the NEW shapes to be added:
        """;

                var result = await _kernel.InvokePromptAsync(prompt, new KernelArguments(settings));
                return result.ToString();
            }
            catch (Exception ex)
            {
                // Logs the exception to the Visual Studio Output window
                Console.WriteLine($"[Critical DrawingProvider Error] {ex.Message}");

                // Fallback shape to prevent frontend crash on white canvas
                return "{\"Commands\": [{\"type\": \"rect\", \"x\": 50, \"y\": 50, \"width\": 100, \"height\": 100, \"color\": \"red\"}]}";
            }
        }
    }
}