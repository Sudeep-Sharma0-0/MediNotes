namespace MediNotes.Api.Dtos
{
  public class UserInfoDto
  {
    public Guid Uuid { get; set; }
    public string Username { get; set; } = null!;
    public string Email { get; set; } = null!;
    public UserPersonalDataDto? PersonalData { get; set; }
    public List<UserImageDto>? UserImages { get; set; }
  }

  public class UserPersonalDataDto
  {
    public string FullName { get; set; } = null!;
    public string? Address { get; set; }
    public DateTime? DateOfBirth { get; set; }
  }

  public class UserImageDto
  {
    public int Id { get; set; }
    public string ImagePath { get; set; } = null!;
    public string ImageType { get; set; } = "profile";
  }
}
