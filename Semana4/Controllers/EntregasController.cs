using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Semana4.Models;
using Semana4.Data;
using Microsoft.AspNetCore.Mvc.Rendering;

public class EntregasController : Controller
{
    private readonly ApplicationDbContext _context;

    public EntregasController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: ENTREGAS
    public async Task<IActionResult> Index()
    {
        var entregas = _context.Entregas
            .Include(e => e.Cliente)
            .Include(e => e.Paquete);

        return View(await entregas.ToListAsync());
    }

    // GET: ENTREGAS/Details/5
    public async Task<IActionResult> Details(int? ent_id)
    {
        if (ent_id == null)
        {
            return NotFound();
        }

        var entrega = await _context.Entregas
            .FirstOrDefaultAsync(m => m.Ent_Id == ent_id);
        if (entrega == null)
        {
            return NotFound();
        }

        return View(entrega);
    }

    // GET: ENTREGAS/Create
    public IActionResult Create()
    {
        CargarDatos();
        return View();
    }

    // POST: ENTREGAS/Create
    // To protect from overposting attacks, enable the specific properties you want to bind to.
    // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
    // POST: ENTREGAS/Create
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create([Bind("Ent_Id,Cli_Id,Paq_Id,Ent_FechaAEntregar,Ent_Observaciones")] Entrega entrega)
    {
        ModelState.Remove("Cliente");
        ModelState.Remove("Paquete");
        ModelState.Remove("Ent_Registro");

        if (entrega.Ent_FechaAEntregar.Date < DateTime.Today)
        {
            ModelState.AddModelError("Ent_FechaAEntregar", "La fecha a entregar no puede ser una fecha pasada.");
        }

        if (ModelState.IsValid)
        {
            entrega.Ent_Registro = DateTime.Now;

            _context.Add(entrega);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }
        CargarDatos();
        return View(entrega);
    }

   

    // GET: ENTREGAS/Delete/5
    public async Task<IActionResult> Delete(int? ent_id)
    {
        if (ent_id == null)
        {
            return NotFound();
        }

        var entrega = await _context.Entregas
                .Include(e => e.Cliente)
                .Include(e => e.Paquete)
                .FirstOrDefaultAsync(m => m.Ent_Id == ent_id);

        if (entrega == null)
        {
            return NotFound();
        }

        return View(entrega);
    }

    // POST: ENTREGAS/Delete/5
    [HttpPost, ActionName("Delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteConfirmed(int? ent_id)
    {
        var entrega = await _context.Entregas.FindAsync(ent_id);
        if (entrega != null)
        {
            _context.Entregas.Remove(entrega);
        }

        await _context.SaveChangesAsync();
        return RedirectToAction(nameof(Index));
    }

    private bool EntregaExists(int? ent_id)
    {
        return _context.Entregas.Any(e => e.Ent_Id == ent_id);
    }

    private void CargarDatos()
    {
        ViewData["Cli_Id"] = new SelectList(_context.Clientes, "Cli_Id", "Cli_Nombre");
        ViewData["Paq_Id"] = new SelectList(_context.Paquetes, "Paq_Id", "Paq_Id");
    }

    [HttpGet]
    public async Task<IActionResult> ObtenerContenidoPaquete(int Paquete)
    {
        var paquete = await _context.Paquetes.FindAsync(Paquete);

        if (paquete == null)
        {
            return NotFound();
        }
        return Json(new { contenido = paquete.Paq_Contenido });
    }
}
