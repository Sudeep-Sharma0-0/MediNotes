using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

public class Note
{
  [Key]
  public Guid Id { get; set; }

  [Required]
  public Guid UserId { get; set; }

  [Required]
  public Guid MedicalSystemId { get; set; }

  [Required]
  [MaxLength(200)]
  public string DiseaseName { get; set; }

  [Required]
  public string MarkdownContent { get; set; }

  public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

  public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

  // Navigation properties
  [ForeignKey(nameof(UserId))]
  public User User { get; set; }
}
