using System.ComponentModel.DataAnnotations;

public class UserRegisterDto
{
  [Required]
  [MaxLength(255)]
  public string Username { get; set; } = null!;

  [Required]
  [EmailAddress]
  [MaxLength(255)]
  public string Email { get; set; } = null!;

  [Required]
  [MinLength(6)]
  public string Password { get; set; } = null!;

  [Required]
  public string FullName { get; set; } = null!;

  public string Address { get; set; } = null!;
  public DateTime? DateOfBirth { get; set; }

  public UserImageDto UserImage { get; set; } = null!;
}
