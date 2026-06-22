using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API_LogIn.Models;
using API_LogIn.Data;

[Route("api/[controller]")]
[ApiController]
public class UsuariosApiController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    public UsuariosApiController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: api/Usuario
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Usuario>>> GetUsuario()
    {
        return await _context.Usuarios.ToListAsync();
    }

    // GET: api/Usuario/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Usuario>> GetUsuario(int id)
    {
        var usuario = await _context.Usuarios.FindAsync(id);

        if (usuario == null)
        {
            return NotFound();
        }

        return usuario;
    }

    [HttpPost("Login")]
    public async Task<ActionResult<object>> Login([FromBody] Usuario loginRequest)
    { 
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }
        string contrasenaHash = SHA256(loginRequest.Contrasena);

        var usuarioValido = await _context.Usuarios
            .FirstOrDefaultAsync(u => u.Nombre_Usuario == loginRequest.Nombre_Usuario 
            && u.Contrasena == contrasenaHash);

        if (usuarioValido == null)
        {
            return Unauthorized(new { message = "Credenciales inválidas" });
        }

        return Ok(new
        {
            mensaje = "Inicio de sesión exitoso.",
            usuarioId = usuarioValido.Id
        });
    }

    private string SHA256(string texto)
    {
        using (var sha256 = System.Security.Cryptography.SHA256.Create())
        {
            byte[] bytes = System.Text.Encoding.UTF8.GetBytes(texto);
            byte[] hashBytes = sha256.ComputeHash(bytes);
            return Convert.ToHexString(hashBytes);
        }
    }
}
