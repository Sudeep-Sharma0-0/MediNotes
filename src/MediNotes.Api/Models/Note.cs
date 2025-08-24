using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MediNotes.Api.Models
{
  public class NoteBook
  {
    [Key]
    public Guid Uuid { get; set; }

    [Required, MaxLength(255)]
    public String Title { get; set; } = "Notebook";

    [ForeignKey("User")]
    public Guid UserUuid { get; set; }

    [Required]
    public DateTime CreatedAt { get; set; }

    [Required]
    public DateTime UpdatedAt { get; set; }

    public User? User { get; set; }
    public ICollection<Note> Notes { get; set; } = new List<Note>();
  }

  public class Note
  {
    [Key]
    public Guid Uuid { get; set; }

    [Required, MaxLength(255)]
    public String Title { get; set; } = "Untitled";

    public List<ContentBlock> Content { get; set; } = new();

    [ForeignKey("NoteBook")]
    public Guid NoteBookUuid { get; set; }

    [Required]
    public DateTime CreatedAt { get; set; }

    [Required]
    public DateTime UpdatedAt { get; set; }

    public NoteBook? NoteBook { get; set; }
  }
}
