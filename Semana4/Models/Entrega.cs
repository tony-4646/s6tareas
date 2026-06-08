using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Semana4.Models
{
    public class Entrega
    {
        [Key]
        public int Ent_Id { get; set; }

        [Required(ErrorMessage = "El campo es obligatorio.")]
        public int Cli_Id { get; set; }

        [Required(ErrorMessage = "El campo es obligatorio.")]
        public int Paq_Id { get; set; }

        [Required(ErrorMessage = "El campo es obligatorio.")]
        public DateTime Ent_FechaAEntregar { get; set; }

        [MaxLength(100, ErrorMessage = "El campo no puede exceder los 100 caracteres.")]
        public string Ent_Observaciones { get; set; }

        public DateTime Ent_Registro { get; set; } = DateTime.Now;

        [ForeignKey(nameof(Cli_Id))]
        [ScaffoldColumn(false)]
        public Cliente Cliente { get; set; }

        [ForeignKey(nameof(Paq_Id))]
        [ScaffoldColumn(false)]
        public Paquete Paquete { get; set; }
    }
}
