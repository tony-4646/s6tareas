using System.ComponentModel.DataAnnotations;

namespace API_LogIn.Models
{
    public class Usuario
    {
        public int Id { get; set; }

        [MinLength(5, ErrorMessage = "El mínimo de caracteres para el usuario es de 5")]
        [Required (ErrorMessage ="El usuario es requerido")]
        public string Nombre_Usuario { get; set; }

        [Required(ErrorMessage = "La contraseña es requerida")]
        [MinLength (5, ErrorMessage ="El mínimo de caracteres para la contraseña es de 5")]
        public string Contrasena { get; set; }
    }
}
