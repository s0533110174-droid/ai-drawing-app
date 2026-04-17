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

    [HttpGet("Generate")]
    public async Task<IActionResult> Generate([FromQuery] string prompt, [FromQuery] string currentShapesJson)
    {
        if (string.IsNullOrEmpty(prompt)) return BadRequest("Prompt is required");

        var result = await _provider.GenerateAiDrawingAsync(prompt, currentShapesJson);
        return Ok(new { drawingData = result });
    }

    [HttpPost("Save")]
    public async Task<IActionResult> Save([FromBody] string drawingDataJson)
    {
        if (string.IsNullOrEmpty(drawingDataJson)) return BadRequest("Drawing data is required");

        var result = await _provider.SaveDrawingToDb(drawingDataJson);
        return Ok(new { drawingId = result });
    }

    [HttpGet("GetFullUserDrawings")]
    public async Task<IActionResult> GetFullUserDrawings()
    {
        var result = await _provider.GetFullUserDrawings(); 
        return Ok(new { drawings = result });
    }
}