using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ExamenReservacionesP1.Models;
using ExamenReservacionesP1.Data;
using Microsoft.AspNetCore.Mvc.Rendering;

public class ReservacionesController : Controller
{
    private readonly ApplicationDbContext _context;

    public ReservacionesController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: RESERVACIONESMODELS
    public async Task<IActionResult> Index()    
    {
        var reservaciones = _context.ReservacionesModel
            .Include(r => r.Cliente)
            .Include(r => r.Evento)
            .Where (r => r.Evento.Eve_Fecha >= DateTime.Today);

        return View(await reservaciones.ToListAsync());
    }

    // GET: RESERVACIONESMODELS/Details/5
    public async Task<IActionResult> Details(int? num_reserva)
    {
        if (num_reserva == null)
        {
            return NotFound();
        }

        var reservacionesmodel = await _context.ReservacionesModel
            .Include(r => r.Cliente)
            .Include(r => r.Evento)
            .FirstOrDefaultAsync(m => m.Num_Reserva == num_reserva);
        if (reservacionesmodel == null)
        {
            return NotFound();
        }

        return View(reservacionesmodel);
    }

    // GET: RESERVACIONESMODELS/Create
    public IActionResult Create()
    {
        CargaDatos();
        return View();
    }

    // POST: RESERVACIONESMODELS/Create
    // To protect from overposting attacks, enable the specific properties you want to bind to.
    // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create([Bind("Estado,Cliente_Id,Evento_Id")] ReservacionesModel reservacionesmodel)
    {
        ModelState.Remove(nameof(reservacionesmodel.Cliente));
        ModelState.Remove(nameof(reservacionesmodel.Evento));

        bool existeReserva = await _context.ReservacionesModel.AnyAsync
            (r => r.Cliente_Id == reservacionesmodel.Cliente_Id 
            && r.Evento_Id == reservacionesmodel.Evento_Id && r.Estado == true);
        if (existeReserva)
        {
            ModelState.AddModelError(string.Empty, "El cliente ya tiene una reserva activa para este evento.");
        }

        if (ModelState.IsValid)
        {
            _context.Add(reservacionesmodel);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }
        CargaDatos();
        return View(reservacionesmodel);
    }

    // GET: RESERVACIONESMODELS/Delete/5
    public async Task<IActionResult> Delete(int? num_reserva)
    {
        if (num_reserva == null)
        {
            return NotFound();
        }

        var reservacionesmodel = await _context.ReservacionesModel
            .Include(r => r.Cliente)
            .Include(r => r.Evento)
            .FirstOrDefaultAsync(m => m.Num_Reserva == num_reserva);
        if (reservacionesmodel == null)
        {
            return NotFound();
        }

        return View(reservacionesmodel);
    }

    // POST: RESERVACIONESMODELS/Delete/5
    [HttpPost, ActionName("Delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteConfirmed(int? num_reserva)
    {
        var reservacionesmodel = await _context.ReservacionesModel.FindAsync(num_reserva);
        if (reservacionesmodel != null)
        {
            reservacionesmodel.Estado = false;
            _context.Update(reservacionesmodel);
            await _context.SaveChangesAsync();
        }
        return RedirectToAction(nameof(Index));
    }

    private void CargaDatos()
    {
        var eventosafuturo = _context.EventosModel.Where(e => e.Eve_Fecha > DateTime.Now).ToList();

        ViewData["Cliente_Id"] = new SelectList(_context.ClientesModel, "Cliente_Id", "Cli_NombreCompleto");
        ViewData["Evento_Id"] = new SelectList(eventosafuturo, "Evento_Id", "Eve_Nombre");
    }
}
