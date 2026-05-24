using System.ComponentModel.DataAnnotations;

namespace Semana2.Models
{
    public class ClienteModel
    {
        [Key]
        public int Id { get; set; }
        [Required(ErrorMessage = "El campo es obligatorio.")]
        [MaxLength(100, ErrorMessage ="El máximo de caracteres es 100")]
        public string Nombres { get; set; }
        [Required(ErrorMessage = "El campo es obligatorio.")]
        [MaxLength(100, ErrorMessage = "El máximo de caracteres es 100")]
        public string Apellidos { get; set; }
        [Required(ErrorMessage = "El campo es obligatorio.")]
        [MinLength(10, ErrorMessage ="El mínimo de digitos es 10.")]
        public string Cedula_ruc { get; set; }
        [Required(ErrorMessage = "El campo es obligatorio.")]
        public string Direccion { get; set; }
        [Required(ErrorMessage = "El campo es obligatorio.")]
        [MinLength(10, ErrorMessage = "El mínimo de digitos es 10.")]
        [MaxLength(15, ErrorMessage = "El máximo de caracteres es 15")]
        public string Telefono { get; set; }
    }
}
