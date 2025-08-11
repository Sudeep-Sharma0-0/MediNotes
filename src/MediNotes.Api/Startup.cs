using Microsoft.EntityFrameworkCore;

public class Startup
{
  public Startup(IConfiguration configuration)
  {
    Configuration = configuration;
  }

  public IConfiguration Configuration { get; }

  public void ConfigureServices(IServiceCollection services)
  {
    services.AddControllers();

    services.AddScoped<IUserService, UserService>();

    services.AddDbContext<MediNotesDbContext>(options =>
        options.UseNpgsql(Configuration.GetConnectionString("DefaultConnection")));

    services.AddSwaggerGen();
  }

  public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
  {
    if (env.IsDevelopment())
    {
      app.UseDeveloperExceptionPage();

      app.UseSwagger();

      app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "MediNotes API v1"));
    }

    app.UseHttpsRedirection();

    app.UseRouting();

    app.UseAuthorization();

    app.UseEndpoints(endpoints =>
    {
      endpoints.MapControllers();
    });
  }
}
