using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ExamenReservacionesP1.Models
{
    public class ClientesModel
    {
        [Key]
        public int Cliente_Id { get; set; }

        [Required(ErrorMessage = "El nombre es obligatorio.")]
        [MaxLength(50, ErrorMessage = "El numero de caracteres máximo es de 50.")]
        public string Cli_Nombre { get; set; }

        [Required(ErrorMessage = "El apellido es obligatorio.")]
        [MaxLength(50, ErrorMessage = "El numero de caracteres máximo es de 50.")]
        public string Cli_Apellido { get; set; }

        [Required(ErrorMessage = "El correo electrónico es obligatorio.")]
        [EmailAddress(ErrorMessage = "El formato del correo electrónico no es válido.")]
        [MaxLength(100, ErrorMessage = "El numero de caracteres máximo es de 100.")]
        public string Cli_Email { get; set; }

        [Required(ErrorMessage = "El teléfono es obligatorio.")]
        [MaxLength(10, ErrorMessage = "El numero de caracteres máximo es de 10.")]
        [MinLength(10, ErrorMessage = "El numero de caracteres mínimo es de 10.")]
        public string Cli_Telefono { get; set; }

        [NotMapped]
        public string Cli_NombreCompleto
        {
            get { return $"{Cli_Nombre} {Cli_Apellido}"; }
        }
    }
}

//`Clientes` (cliente_id, nombre, apellido, email, telefono).
