using Microsoft.EntityFrameworkCore;

using MediNotes.Api.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<INoteService, NoteService>();

builder.Services.AddDbContext<MediNotesDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddSwaggerGen();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
  app.UseDeveloperExceptionPage();
  app.UseSwagger();
  app.UseSwaggerUI(c =>
      {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "MediNotes API v1");
      });
}

app.UseHttpsRedirection();

app.UseRouting();

app.UseAuthorization();

app.MapControllers();

app.Run();
