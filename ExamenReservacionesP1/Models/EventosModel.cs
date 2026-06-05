using System.ComponentModel.DataAnnotations;

namespace ExamenReservacionesP1.Models
{
    public class EventosModel
    {
        [Key]
        public int Evento_Id { get; set; }

        [Required(ErrorMessage = "El nombre es obligatorio.")]
        [MaxLength(100, ErrorMessage = "El numero de caracteres máximo es de 100.")]
        public string Eve_Nombre { get; set; }

        [Required(ErrorMessage = "La descripción es obligatoria.")]
        [MaxLength(300, ErrorMessage = "El numero de caracteres máximo es de 300.")]
        public string Eve_Descripcion { get; set; }

        [Required(ErrorMessage = "La fecha es obligatoria.")]
        public DateTime Eve_Fecha { get; set; }

        [Required(ErrorMessage = "La ubicación es obligatoria.")]
        [MaxLength(300, ErrorMessage = "El numero de caracteres máximo es de 300.")]
        public string Eve_Ubicacion { get; set; }
    }
}

//`Eventos` (evento_id, nombre, descripcion, fecha, ubicacion).