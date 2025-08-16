using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

public class UserService : IUserService
{
  private readonly MediNotesDbContext _context;

  public UserService(MediNotesDbContext context)
  {
    _context = context;
  }

  public async Task<bool> UserExistsAsync(string Email)
  {
    return await _context.Users.AnyAsync(u => u.Email == Email);
  }
  public async Task<bool> UsernameExistsAsync(string Username)
  {
    return await _context.Users.AnyAsync(u => u.Username == Username);
  }

  public async Task<UserInfoDto> CreateUserAsync(UserRegisterDto UserDto)
  {
    DateTime now = DateTime.UtcNow;

    var user = new User
    {
      Uuid = Guid.NewGuid(),
      Username = UserDto.Username,
      Email = UserDto.Email,
      CreatedAt = now,
      UpdatedAt = now
    };

    var passwordHasher = new PasswordHasher<User>();
    var passwordHash = passwordHasher.HashPassword(user, UserDto.Password);

    var userPasswords = new UsersPasswordHashes
    {
      UserUuid = user.Uuid,
      Hash = passwordHash,
      CreatedAt = DateTime.UtcNow,
      UpdatedAt = DateTime.UtcNow,
      User = user
    };

    user.PasswordHash = userPasswords;

    if (!string.IsNullOrEmpty(UserDto.FullName))
    {
      var personalData = new UsersPersonalData
      {
        UserUuid = user.Uuid,
        FullName = UserDto.FullName,
        Address = UserDto.Address,
        DateOfBirth = UserDto.DateOfBirth,
        CreatedAt = DateTime.UtcNow,
        UpdatedAt = DateTime.UtcNow,
        User = user
      };
      user.PersonalData = personalData;
    }

    if (!string.IsNullOrEmpty(UserDto.UserImage?.ImagePath))
    {
      var userImage = new UserImage
      {
        UserUuid = user.Uuid,
        ImagePath = UserDto.UserImage.ImagePath,
        ImageType = UserDto.UserImage.ImageType ?? "profile",
        CreatedAt = DateTime.UtcNow,
        UpdatedAt = DateTime.UtcNow,
        User = user
      };
      user.Images.Add(userImage);
    }

    _context.Users.Add(user);
    await _context.SaveChangesAsync();

    var userInfo = new UserInfoDto
    {
      Uuid = user.Uuid,
      Username = user.Username,
      Email = user.Email,
      PersonalData = user.PersonalData == null ? null : new UserPersonalDataDto
      {
        FullName = user.PersonalData.FullName,
        Address = user.PersonalData.Address,
        DateOfBirth = user.PersonalData.DateOfBirth
      },
      UserImages = user.Images
            .Where(img => img.ImageType == "profile")
            .Select(img => new UserImageDto
            {
              ImagePath = img.ImagePath,
              ImageType = img.ImageType
            })
            .ToList()
    };

    return userInfo;
  }
}
