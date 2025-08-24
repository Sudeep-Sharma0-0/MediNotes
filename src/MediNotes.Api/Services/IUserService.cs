using MediNotes.Api.Dtos;

namespace MediNotes.Api.Services
{
  public interface IUserService
  {
    Task<bool> UserExistsAsync(string Email);
    Task<bool> UsernameExistsAsync(string Username);
    Task<bool> UserUuidExistsAsync(string Uuid);
    Task<UserInfoDto> CreateUserAsync(UserRegisterDto UserDto);
  }
}
