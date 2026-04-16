using System.Text.Json.Serialization;

namespace DrawingApp.DM;

public class User
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;

    [JsonIgnore] 
    public List<Drawing> Drawings { get; set; } = new();
}