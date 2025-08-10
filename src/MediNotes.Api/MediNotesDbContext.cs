using Microsoft.EntityFrameworkCore;

public class MediNotesDbContext : DbContext
{
  public MediNotesDbContext(DbContextOptions<MediNotesDbContext> options)
      : base(options)
  {
  }

  public DbSet<User> Users { get; set; } = null!;
  public DbSet<UsersPersonalData> UsersPersonalData { get; set; } = null!;
  public DbSet<UsersPasswordHashes> UsersPasswordHashes { get; set; } = null!;
  public DbSet<UserImage> UserImages { get; set; } = null!;

  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
    base.OnModelCreating(modelBuilder);

    // Configure 1:1 relationship User <-> UsersPersonalData
    modelBuilder.Entity<User>()
        .HasOne(u => u.PersonalData)
        .WithOne(pd => pd.User)
        .HasForeignKey<UsersPersonalData>(pd => pd.UserUuid);

    // Configure 1:1 relationship User <-> UsersPasswordHashes
    modelBuilder.Entity<User>()
        .HasOne(u => u.PasswordHash)
        .WithOne(ph => ph.User)
        .HasForeignKey<UsersPasswordHashes>(ph => ph.UserUuid);

    // Configure 1:N relationship User <-> UserImages
    modelBuilder.Entity<User>()
        .HasMany(u => u.Images)
        .WithOne(img => img.User)
        .HasForeignKey(img => img.UserUuid);

    // Optional: set default value for ImageType
    modelBuilder.Entity<UserImage>()
        .Property(img => img.ImageType)
        .HasDefaultValue("profile");
  }
}
