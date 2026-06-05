using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExamenReservacionesP1.Models
{
    public class ReservacionesModel
    {
        [Key]
        public int Num_Reserva { get; set; }

        public DateTime Fecha_Reserva { get; set; } = DateTime.Now;

        public bool Estado { get; set; } = true;

        [Required (ErrorMessage = "El cliente es obligatorio.")]
        public int Cliente_Id { get; set; }

        [Required(ErrorMessage = "El evento es obligatorio.")]
        public int Evento_Id { get; set; }

        [ForeignKey(nameof(Evento_Id))]
        public virtual EventosModel? Evento { get; set; }

        [ForeignKey(nameof(Cliente_Id))]
        public virtual ClientesModel? Cliente { get; set; }
    }
}
