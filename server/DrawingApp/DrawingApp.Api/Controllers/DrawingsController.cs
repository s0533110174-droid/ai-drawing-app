using DrawingApp.Providers;
using Microsoft.AspNetCore.Mvc;

namespace DrawingApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DrawingsController : ControllerBase
{
    private readonly DrawingProvider _provider;

    public DrawingsController(DrawingProvider provider)
    {
        _provider = provider;
    }

    [HttpGet("generate")]
    public async Task<IActionResult> Generate([FromQuery] string prompt)
    {
        if (string.IsNullOrEmpty(prompt)) return BadRequest("Prompt is required");

        var result = await _provider.GenerateAiDrawingAsync(prompt);
        return Ok(new { drawingData = result });
    }
}