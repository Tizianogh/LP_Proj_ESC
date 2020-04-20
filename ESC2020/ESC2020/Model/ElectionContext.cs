using ESC2020.Model;
using Microsoft.EntityFrameworkCore;
namespace ESC2020.Model { 

    public class ElectionContext : DbContext
    {
        public ElectionContext(DbContextOptions<ElectionContext> options) : base(options)
        {
        }

        
        public DbSet<Users> User { get; set; }

        public DbSet<Election> elec { get; set; }

        public DbSet<Message> Messages { get; set; }

        public DbSet<Notification> Notifications { get; set; }

        public DbSet<Opinion> Opinions { get; set; }

        public DbSet<Participant> Participants { get; set; }

        public DbSet<Phase> Phases { get; set; }

        public DbSet<TypeOpinion> TypeOpinions { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Users>().ToTable("Users");
            modelBuilder.Entity<Election>().ToTable("Election");
            modelBuilder.Entity<Message>().ToTable("Message");
            modelBuilder.Entity<Notification>().ToTable("Notification");
            modelBuilder.Entity<Opinion>().ToTable("Opinion");
            modelBuilder.Entity<Participant>().ToTable("Participant");
            modelBuilder.Entity<Phase>().ToTable("Phase");
            modelBuilder.Entity<TypeOpinion>().ToTable("TypeOpinion");
            modelBuilder.Entity<Participant>()
                .HasKey(c => new { c.UserId, c.ElectionId });
        }

    }
}