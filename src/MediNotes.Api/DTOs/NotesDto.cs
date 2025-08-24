using MediNotes.Api.Models;

namespace MediNotes.Api.Dtos
{
  public class NoteDto
  {
    public Guid NoteUuid { get; set; }
    public Guid NoteBookUuid { get; set; }
    public string Title { get; set; } = string.Empty;
    public List<ContentBlock> Content { get; set; } = new List<ContentBlock>();
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
  }

  public class NoteSummaryDto
  {
    public Guid NoteUuid { get; set; }
    public Guid NoteBookUuid { get; set; }
    public string Title { get; set; } = string.Empty;
    public DateTime UpdatedAt { get; set; }
  }

  public class UpsertNoteRequestDto
  {
    public Guid NoteUuid { get; set; }
    public Guid NoteBookUuid { get; set; }
    public string Title { get; set; } = string.Empty;
    public List<ContentBlock> Content { get; set; } = new List<ContentBlock>();
  }
}
