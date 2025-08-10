public interface IUserService
{
  Task<bool> UserExistsAsync(string Email);
  Task<bool> UsernameExistsAsync(string Username);
  Task<UserInfoDto> CreateUserAsync(UserRegisterDto UserDto);
}
