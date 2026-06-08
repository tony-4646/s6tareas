using System.ComponentModel.DataAnnotations;

namespace Semana4.Models
{
    public class Cliente
    {
        [Key]
        public int Cli_Id { get; set; }

        [Required(ErrorMessage = "El campo es obligatorio.")]
        [MaxLength(100, ErrorMessage = "El campo no puede exceder los 100 caracteres.")]
        public string Cli_Nombre { get; set; }

        [Required(ErrorMessage = "El campo es obligatorio.")]
        [MaxLength(10, ErrorMessage = "El campo no puede exceder los 10 caracteres.")]
        [MinLength(10, ErrorMessage = "El campo debe tener 10 caracteres.")]
        public string Cli_Cedula { get; set; }

        [Required(ErrorMessage = "El campo es obligatorio.")]
        [MaxLength(15, ErrorMessage = "El campo no puede exceder los 15 caracteres.")]
        [MinLength(10, ErrorMessage = "El campo debe tener al menos 10 caracteres.")]
        public string Cli_Telefono { get; set; }

        [Required(ErrorMessage = "El campo es obligatorio.")]
        [MaxLength(200, ErrorMessage = "El campo no puede exceder los 200 caracteres.")]
        public string Cli_Direccion { get; set; }
        public DateTime Cli_Registro { get; set; } = DateTime.Now;
    }
}
