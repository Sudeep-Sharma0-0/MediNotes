using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
  private readonly IUserService _userService;
  private readonly IConfiguration _configuration;

  public AuthController(IUserService userService, IConfiguration configuration)
  {
    _userService = userService;
    _configuration = configuration;
  }

  [HttpPost("register")]
  public async Task<IActionResult> Register([FromBody] UserRegisterDto userRegisterDto)
  {
    if (!ModelState.IsValid)
      return BadRequest(ModelState);

    var userExists = await _userService.UserExistsAsync(userRegisterDto.Email);
    if (userExists)
      return BadRequest("User already exists.");
    var usernameExists = await _userService.UserExistsAsync(userRegisterDto.Username);
    if (usernameExists)
      return BadRequest("Username already exists. Choose a different username!");

    var user = await _userService.CreateUserAsync(userRegisterDto);
    if (user == null)
      return StatusCode(500, "User creation failed.");

    return Ok("User registered successfully.");
  }
}
