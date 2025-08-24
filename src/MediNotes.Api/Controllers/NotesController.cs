using Microsoft.AspNetCore.Mvc;

using MediNotes.Api.Services;
using MediNotes.Api.Dtos;

namespace MediNotes.Api.Controllers
{
  [ApiController]
  [Route("api/[controller]")]
  public class NotesController : ControllerBase
  {
    private readonly IUserService _userService;
    private readonly INoteService _noteService;

    public NotesController(IUserService userService, INoteService noteService)
    {
      _userService = userService;
      _noteService = noteService;
    }

    [HttpGet("notes")]
    public async Task<IActionResult> GetNotes(string Uuid)
    {
      if (String.IsNullOrEmpty(Uuid))
        return BadRequest("UUID not passed!");

      bool userUuidExists = await _userService.UserUuidExistsAsync(Uuid);
      if (!userUuidExists)
        return BadRequest("User not found!");

      return Ok("Working");
    }

    [HttpGet("note")]
    public async Task<IActionResult> GetNoteById(string Uuid)
    {
      var note = await _noteService.GetNoteByIdAsync(Uuid);

      if (note == null) return NotFound();
      var noteDto = new NoteDto
      {
        NoteUuid = note.Uuid,
        NoteBookUuid = note.NoteBookUuid,
        Title = note.Title,
        Content = note.Content,
        CreatedAt = note.CreatedAt,
        UpdatedAt = note.UpdatedAt
      };
      return Ok(noteDto);
    }

    [HttpPost("note")]
    public async Task<IActionResult> UploadNote([FromBody] UpsertNoteRequestDto upsertNoteDto)
    {
      try
      {
        (NoteDto upsertedNote, bool wasCreated) = await _noteService.UpsertNoteAsync(upsertNoteDto);

        if (wasCreated)
        {
          return CreatedAtAction(nameof(GetNoteById), new { id = upsertedNote.NoteUuid }, upsertedNote);
        }
        else
        {
          return Ok(upsertedNote);
        }
      }
      catch (KeyNotFoundException ex)
      {
        return NotFound(new { message = ex.Message });
      }
    }
  }
}
