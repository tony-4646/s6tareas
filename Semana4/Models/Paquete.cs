using System.ComponentModel.DataAnnotations;

namespace Semana4.Models
{
    public class Paquete
    {
        [Key]
        public int Paq_Id { get; set; }

        [Required(ErrorMessage = "El campo es obligatorio.")]
        [MaxLength(200, ErrorMessage = "El campo no puede exceder los 200 caracteres.")]
        public string Paq_Contenido { get; set; }

        [Required(ErrorMessage = "El campo es obligatorio.")]
        [MaxLength(50, ErrorMessage = "El campo no puede exceder los 50 caracteres.")]
        public string Paq_Tamano { get; set; }

        [Required(ErrorMessage = "El campo es obligatorio.")]
        public double Paq_Precio { get; set; }

        [Required(ErrorMessage = "El campo es obligatorio.")]
        [MaxLength(100, ErrorMessage = "El campo no puede exceder los 100 caracteres.")]
        public string Paq_Almacen { get; set; }
        public DateTime Paq_Registro { get; set; } = DateTime.Now;
    }
}
