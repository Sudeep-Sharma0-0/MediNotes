using MediNotes.Api.Dtos;
using MediNotes.Api.Models;

namespace MediNotes.Api.Services
{
  public interface INoteService
  {
    Task<(NoteDto, bool)> UpsertNoteAsync(UpsertNoteRequestDto upsertNoteDto);
    Task<Note?> GetNoteByIdAsync(string Uuid);
    Task<bool> NoteExists(Guid Uuid);
  }
}
