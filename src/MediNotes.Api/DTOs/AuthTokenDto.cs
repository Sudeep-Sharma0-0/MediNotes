namespace MediNotes.Api.Dtos
{
  public class AuthTokenDto
  {
    public string Token { get; set; } = String.Empty;
    public DateTime Expiration { get; set; }
  }
}
