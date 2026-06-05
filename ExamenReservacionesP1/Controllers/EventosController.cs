
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ExamenReservacionesP1.Models;
using ExamenReservacionesP1.Data;

public class EventosController : Controller
{
    private readonly ApplicationDbContext _context;

    public EventosController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: EVENTOSMODELS
    public async Task<IActionResult> Index()    
    {
        return View(await _context.EventosModel.ToListAsync());
    }

    // GET: EVENTOSMODELS/Details/5
    public async Task<IActionResult> Details(int? evento_id)
    {
        if (evento_id == null)
        {
            return NotFound();
        }

        var eventosmodel = await _context.EventosModel
            .FirstOrDefaultAsync(m => m.Evento_Id == evento_id);
        if (eventosmodel == null)
        {
            return NotFound();
        }

        return View(eventosmodel);
    }

    // GET: EVENTOSMODELS/Create
    public IActionResult Create()
    {
        return View();
    }

    // POST: EVENTOSMODELS/Create
    // To protect from overposting attacks, enable the specific properties you want to bind to.
    // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create([Bind("Evento_Id,Eve_Nombre,Eve_Descripcion,Eve_Fecha,Eve_Ubicacion")] EventosModel eventosmodel)
    {
        if (eventosmodel.Eve_Fecha <= DateTime.Now)
        {
            ModelState.AddModelError(nameof(eventosmodel.Eve_Fecha), "La fecha del evento no puede ser en fechas pasadas u hoy.");
        }

        bool eventoExistente= await _context.EventosModel
            .AnyAsync(e => e.Eve_Nombre == eventosmodel.Eve_Nombre);

        if (eventoExistente)
        {
            ModelState.AddModelError(nameof(eventosmodel.Eve_Nombre), "Ya existe este evento.");
        }

        if (ModelState.IsValid)
        {
            _context.Add(eventosmodel);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }
        return View(eventosmodel);
    }

    // GET: EVENTOSMODELS/Edit/5
    public async Task<IActionResult> Edit(int? evento_id)
    {
        if (evento_id == null)
        {
            return NotFound();
        }

        var eventosmodel = await _context.EventosModel.FindAsync(evento_id);
        if (eventosmodel == null)
        {
            return NotFound();
        }
        return View(eventosmodel);
    }

    // POST: EVENTOSMODELS/Edit/5
    // To protect from overposting attacks, enable the specific properties you want to bind to.
    // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int? evento_id, [Bind("Evento_Id,Eve_Nombre,Eve_Descripcion,Eve_Fecha,Eve_Ubicacion")] EventosModel eventosmodel)
    {
        if (evento_id != eventosmodel.Evento_Id)
        {
            return NotFound();
        }

        if (eventosmodel.Eve_Fecha <= DateTime.Now)
        {
            ModelState.AddModelError(nameof(eventosmodel.Eve_Fecha), "La fecha del evento no puede ser en fechas pasadas u hoy.");
        }
        bool eventoExistente = await _context.EventosModel
            .AnyAsync(e => e.Eve_Nombre == eventosmodel.Eve_Nombre && e.Evento_Id != eventosmodel.Evento_Id);

        if (eventoExistente)
        {
            ModelState.AddModelError(nameof(eventosmodel.Eve_Nombre), "Ya existe este evento.");
        }


        if (ModelState.IsValid)
        {
            try
            {
                _context.Update(eventosmodel);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!EventosModelExists(eventosmodel.Evento_Id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return RedirectToAction(nameof(Index));
        }
        return View(eventosmodel);
    }

    // GET: EVENTOSMODELS/Delete/5
    public async Task<IActionResult> Delete(int? evento_id)
    {
        if (evento_id == null)
        {
            return NotFound();
        }

        var eventosmodel = await _context.EventosModel
            .FirstOrDefaultAsync(m => m.Evento_Id == evento_id);
        if (eventosmodel == null)
        {
            return NotFound();
        }

        return View(eventosmodel);
    }

    // POST: EVENTOSMODELS/Delete/5
    [HttpPost, ActionName("Delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteConfirmed(int? evento_id)
    {
        var eventosmodel = await _context.EventosModel.FindAsync(evento_id);
        if (eventosmodel != null)
        {
            _context.EventosModel.Remove(eventosmodel);
        }

        await _context.SaveChangesAsync();
        return RedirectToAction(nameof(Index));
    }

    private bool EventosModelExists(int? evento_id)
    {
        return _context.EventosModel.Any(e => e.Evento_Id == evento_id);
    }
}
