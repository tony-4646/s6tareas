
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Semana3.Models;
using Semana3.Data;

public class ClientesController : Controller
{
    private readonly ApplicationDbContext _context;

    public ClientesController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: CLIENTESMODELS
    public async Task<IActionResult> Index()    
    {
        return View(await _context.ClientesModel.ToListAsync());
    }

    // GET: CLIENTESMODELS/Details/5
    public async Task<IActionResult> Details(int? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var clientesmodel = await _context.ClientesModel
            .FirstOrDefaultAsync(m => m.id == id);
        if (clientesmodel == null)
        {
            return NotFound();
        }

        return View(clientesmodel);
    }

    // GET: CLIENTESMODELS/Create
    public IActionResult Create()
    {
        return View();
    }

    // POST: CLIENTESMODELS/Create
    // To protect from overposting attacks, enable the specific properties you want to bind to.
    // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create([Bind("id,nombres,apellidos,nacimiento,estado_civil,cedula_ruc,email,telefono,direccion,provincia,pais")] ClientesModel clientesmodel)
    {
        if (ModelState.IsValid)
        {
            _context.Add(clientesmodel);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }
        return View(clientesmodel);
    }

    // GET: CLIENTESMODELS/Edit/5
    public async Task<IActionResult> Edit(int? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var clientesmodel = await _context.ClientesModel.FindAsync(id);
        if (clientesmodel == null)
        {
            return NotFound();
        }
        return View(clientesmodel);
    }

    // POST: CLIENTESMODELS/Edit/5
    // To protect from overposting attacks, enable the specific properties you want to bind to.
    // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int? id, [Bind("id,nombres,apellidos,nacimiento,estado_civil,cedula_ruc,email,telefono,direccion,provincia,pais")] ClientesModel clientesmodel)
    {
        if (id != clientesmodel.id)
        {
            return NotFound();
        }

        if (ModelState.IsValid)
        {
            try
            {
                _context.Update(clientesmodel);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClientesModelExists(clientesmodel.id))
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
        return View(clientesmodel);
    }

    // GET: CLIENTESMODELS/Delete/5
    public async Task<IActionResult> Delete(int? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var clientesmodel = await _context.ClientesModel
            .FirstOrDefaultAsync(m => m.id == id);
        if (clientesmodel == null)
        {
            return NotFound();
        }

        return View(clientesmodel);
    }

    // POST: CLIENTESMODELS/Delete/5
    [HttpPost, ActionName("Delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteConfirmed(int? id)
    {
        var clientesmodel = await _context.ClientesModel.FindAsync(id);
        if (clientesmodel != null)
        {
            _context.ClientesModel.Remove(clientesmodel);
        }

        await _context.SaveChangesAsync();
        return RedirectToAction(nameof(Index));
    }

    private bool ClientesModelExists(int? id)
    {
        return _context.ClientesModel.Any(e => e.id == id);
    }
}
