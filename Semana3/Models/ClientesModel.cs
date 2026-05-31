using System.ComponentModel.DataAnnotations;

namespace Semana3.Models
{
    public class ClientesModel
    {
        public int id { get; set; }
        [Required(ErrorMessage = "Campo obligatorio.")]
        [MaxLength(100, ErrorMessage ="El máximo de caracteres son 100.")]
        public string nombres { get; set; }
        [Required(ErrorMessage = "Campo obligatorio.")]
        [MaxLength(100, ErrorMessage = "El máximo de caracteres son 100.")]
        public string apellidos { get; set; }
        [Required(ErrorMessage = "Campo obligatorio.")]
        public DateTime nacimiento { get; set; }
        [Required(ErrorMessage = "Campo obligatorio.")]
        [MaxLength(50, ErrorMessage = "El máximo de caracteres son 50.")]
        public string estado_civil { get; set; }
        [Required(ErrorMessage = "Campo obligatorio.")]
        [MaxLength(13, ErrorMessage = "El máximo de caracteres son 13.")]
        [MinLength(10, ErrorMessage = "El mínimo de caracteres son 10.")]
        public string cedula_ruc { get; set; }
        [Required(ErrorMessage = "Campo obligatorio.")]
        [EmailAddress(ErrorMessage = "El campo debe ser una dirección de correo electrónico válida.")]
        [MaxLength(100, ErrorMessage = "El máximo de caracteres son 100.")]
        public string email { get; set; }
        [Phone(ErrorMessage = "El campo debe ser un número de teléfono válido.")]
        [Required(ErrorMessage = "Campo obligatorio.")]
        [MaxLength(15, ErrorMessage = "El máximo de caracteres son 15.")]
        [MinLength(10, ErrorMessage = "El mínimo de caracteres son 10.")]
        public string telefono { get; set; }
        [Required(ErrorMessage = "Campo obligatorio.")]
        [MaxLength(200, ErrorMessage = "El máximo de caracteres son 200.")]
        public string direccion { get; set; }
        [Required(ErrorMessage = "Campo obligatorio.")]
        public string provincia { get; set; }
        [Required(ErrorMessage = "Campo obligatorio.")]
        [MaxLength(50, ErrorMessage = "El máximo de caracteres son 50.")]
        public string pais { get; set; }
    }
}
