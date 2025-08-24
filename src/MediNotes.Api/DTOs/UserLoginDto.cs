using System.ComponentModel.DataAnnotations;

namespace MediNotes.Api.Dtos
{
  public class UserLoginDto
  {
    [Required]
    public string Username { get; set; } = String.Empty;

    [Required]
    public string Password { get; set; } = String.Empty;
  }
}
