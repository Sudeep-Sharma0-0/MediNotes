using Microsoft.EntityFrameworkCore;

using MediNotes.Api.Dtos;
using MediNotes.Api.Models;

namespace MediNotes.Api.Services
{
  public class NoteService : INoteService
  {
    private readonly MediNotesDbContext _context;

    public NoteService(MediNotesDbContext context)
    {
      _context = context;
    }

    public async Task<(NoteDto, bool)> UpsertNoteAsync(UpsertNoteRequestDto upsertNoteDto)
    {
      DateTime now = DateTime.UtcNow;

      if (upsertNoteDto.NoteUuid != Guid.Empty)
      {
        var noteExists = await NoteExists(upsertNoteDto.NoteUuid);
        if (!noteExists)
          throw new KeyNotFoundException($"Note with ID: {upsertNoteDto.NoteUuid} not found!");
        var existingNote = await GetNoteByIdAsync(upsertNoteDto.NoteUuid.ToString());

        existingNote.Title = upsertNoteDto.Title;
        existingNote.Content = upsertNoteDto.Content;
        existingNote.NoteBookUuid = upsertNoteDto.NoteBookUuid;
        existingNote.UpdatedAt = now;

        var updatedNote = new NoteDto
        {

          NoteUuid = existingNote.Uuid,
          NoteBookUuid = existingNote.NoteBookUuid,
          Title = existingNote.Title,
          Content = existingNote.Content,
          CreatedAt = existingNote.CreatedAt,
          UpdatedAt = existingNote.UpdatedAt
        };

        await _context.SaveChangesAsync();
        return (updatedNote, false);
      }

      var note = new Note
      {
        Uuid = Guid.NewGuid(),
        NoteBookUuid = upsertNoteDto.NoteBookUuid,
        Title = upsertNoteDto.Title,
        Content = upsertNoteDto.Content,
        CreatedAt = now,
        UpdatedAt = now
      };

      _context.Notes.Add(note);
      await _context.SaveChangesAsync();

      var noteInfo = new NoteDto
      {
        NoteUuid = note.Uuid,
        NoteBookUuid = note.NoteBookUuid,
        Title = note.Title,
        Content = note.Content,
        CreatedAt = note.CreatedAt,
        UpdatedAt = note.UpdatedAt
      };

      return (noteInfo, true);
    }

    public async Task<Note?> GetNoteByIdAsync(string Uuid)
    {
      Guid parsedUuid = Guid.Parse(Uuid);
      return await _context.Notes.FindAsync(parsedUuid);
    }

    public async Task<bool> NoteExists(Guid Uuid)
    {
      return await _context.Notes.AnyAsync(n => n.Uuid == Uuid);
    }
  }
}
