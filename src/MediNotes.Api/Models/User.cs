using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class User
{
  [Key]
  public Guid Uuid { get; set; }

  [Required, MaxLength(255)]
  public string Username { get; set; } = null!;

  [Required, MaxLength(255)]
  public string Email { get; set; } = null!;

  [Required]
  public DateTime CreatedAt { get; set; }

  [Required]
  public DateTime UpdatedAt { get; set; }

  public UsersPersonalData? PersonalData { get; set; }
  public UsersPasswordHashes? PasswordHash { get; set; }
  public ICollection<UserImage> Images { get; set; } = new List<UserImage>();
}

public class UsersPersonalData
{
  [Key, ForeignKey("User")]
  public Guid UserUuid { get; set; }

  [Required]
  public string FullName { get; set; } = null!;

  public string? Address { get; set; }
  public DateTime? DateOfBirth { get; set; }

  [Required]
  public DateTime CreatedAt { get; set; }

  [Required]
  public DateTime UpdatedAt { get; set; }

  public User? User { get; set; }
}

public class UsersPasswordHashes
{
  [Key, ForeignKey("User")]
  public Guid UserUuid { get; set; }

  [Required]
  public string Hash { get; set; } = null!;

  [Required]
  public DateTime CreatedAt { get; set; }

  [Required]
  public DateTime UpdatedAt { get; set; }

  public User? User { get; set; }
}

public class UserImage
{
  [Key]
  public int Id { get; set; }

  [Required, ForeignKey("User")]
  public Guid UserUuid { get; set; }

  [Required]
  public string ImagePath { get; set; } = null!;

  [Required]
  public string ImageType { get; set; } = "profile";

  [Required]
  public DateTime CreatedAt { get; set; }

  [Required]
  public DateTime UpdatedAt { get; set; }

  public User? User { get; set; }
}
