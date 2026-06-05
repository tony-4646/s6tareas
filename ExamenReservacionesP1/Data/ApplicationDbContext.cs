using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ExamenReservacionesP1.Models;
namespace ExamenReservacionesP1.Data
{
    public class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : IdentityDbContext(options)
    {
        public DbSet<ClientesModel> ClientesModel { get; set; }
        public DbSet<EventosModel> EventosModel { get; set; }
        public DbSet<ReservacionesModel> ReservacionesModel { get; set; }
    }
}
