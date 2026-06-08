
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Semana4.Models;
using Semana4.Data;

public class PaquetesController : Controller
{
    private readonly ApplicationDbContext _context;

    public PaquetesController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: PAQUETES
    public async Task<IActionResult> Index()    
    {
        return View(await _context.Paquetes.ToListAsync());
    }

    // GET: PAQUETES/Details/5
    public async Task<IActionResult> Details(int? paq_id)
    {
        if (paq_id == null)
        {
            return NotFound();
        }

        var paquete = await _context.Paquetes
            .FirstOrDefaultAsync(m => m.Paq_Id == paq_id);
        if (paquete == null)
        {
            return NotFound();
        }

        return View(paquete);
    }

    // GET: PAQUETES/Create
    public IActionResult Create()
    {
        return View();
    }

    // POST: PAQUETES/Create
    // To protect from overposting attacks, enable the specific properties you want to bind to.
    // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create([Bind("Paq_Id,Paq_Contenido,Paq_Tamano,Paq_Precio,Paq_Almacen,Paq_Registro")] Paquete paquete)
    {
        if (ModelState.IsValid)
        {
            _context.Add(paquete);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }
        return View(paquete);
    }

    // GET: PAQUETES/Edit/5
    public async Task<IActionResult> Edit(int? paq_id)
    {
        if (paq_id == null)
        {
            return NotFound();
        }

        var paquete = await _context.Paquetes.FindAsync(paq_id);
        if (paquete == null)
        {
            return NotFound();
        }
        return View(paquete);
    }

    // POST: PAQUETES/Edit/5
    // To protect from overposting attacks, enable the specific properties you want to bind to.
    // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int? paq_id, [Bind("Paq_Id,Paq_Contenido,Paq_Tamano,Paq_Precio,Paq_Almacen,Paq_Registro")] Paquete paquete)
    {
        if (paq_id != paquete.Paq_Id)
        {
            return NotFound();
        }

        if (ModelState.IsValid)
        {
            try
            {
                _context.Update(paquete);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!PaqueteExists(paquete.Paq_Id))
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
        return View(paquete);
    }

    // GET: PAQUETES/Delete/5
    public async Task<IActionResult> Delete(int? paq_id)
    {
        if (paq_id == null)
        {
            return NotFound();
        }

        var paquete = await _context.Paquetes
            .FirstOrDefaultAsync(m => m.Paq_Id == paq_id);
        if (paquete == null)
        {
            return NotFound();
        }

        return View(paquete);
    }

    // POST: PAQUETES/Delete/5
    [HttpPost, ActionName("Delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteConfirmed(int? paq_id)
    {
        var paquete = await _context.Paquetes.FindAsync(paq_id);
        if (paquete != null)
        {
            _context.Paquetes.Remove(paquete);
        }

        await _context.SaveChangesAsync();
        return RedirectToAction(nameof(Index));
    }

    private bool PaqueteExists(int? paq_id)
    {
        return _context.Paquetes.Any(e => e.Paq_Id == paq_id);
    }
}
