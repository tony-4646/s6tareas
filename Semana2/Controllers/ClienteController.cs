
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Semana2.Models;
using Semana2.Data;

public class ClienteController : Controller
{
    private readonly ApplicationDbContext _context;

    public ClienteController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: CLIENTEMODELS
    public async Task<IActionResult> Index()    
    {
        return View(await _context.ClienteModel.ToListAsync());
    }

    // GET: CLIENTEMODELS/Details/5
    public async Task<IActionResult> Details(int? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var clientemodel = await _context.ClienteModel
            .FirstOrDefaultAsync(m => m.Id == id);
        if (clientemodel == null)
        {
            return NotFound();
        }

        return View(clientemodel);
    }

    // GET: CLIENTEMODELS/Create
    public IActionResult Create()
    {
        return View();
    }

    // POST: CLIENTEMODELS/Create
    // To protect from overposting attacks, enable the specific properties you want to bind to.
    // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create([Bind("Id,Nombres,Apellidos,Cedula_ruc,Direccion,Telefono")] ClienteModel clientemodel)
    {
        if (ModelState.IsValid)
        {
            _context.Add(clientemodel);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }
        return View(clientemodel);
    }

    // GET: CLIENTEMODELS/Edit/5
    public async Task<IActionResult> Edit(int? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var clientemodel = await _context.ClienteModel.FindAsync(id);
        if (clientemodel == null)
        {
            return NotFound();
        }
        return View(clientemodel);
    }

    // POST: CLIENTEMODELS/Edit/5
    // To protect from overposting attacks, enable the specific properties you want to bind to.
    // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int? id, [Bind("Id,Nombres,Apellidos,Cedula_ruc,Direccion,Telefono")] ClienteModel clientemodel)
    {
        if (id != clientemodel.Id)
        {
            return NotFound();
        }

        if (ModelState.IsValid)
        {
            try
            {
                _context.Update(clientemodel);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClienteModelExists(clientemodel.Id))
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
        return View(clientemodel);
    }

    // GET: CLIENTEMODELS/Delete/5
    public async Task<IActionResult> Delete(int? id)
    {
        if (id == null)
        {
            return NotFound();
        }

        var clientemodel = await _context.ClienteModel
            .FirstOrDefaultAsync(m => m.Id == id);
        if (clientemodel == null)
        {
            return NotFound();
        }

        return View(clientemodel);
    }

    // POST: CLIENTEMODELS/Delete/5
    [HttpPost, ActionName("Delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteConfirmed(int? id)
    {
        var clientemodel = await _context.ClienteModel.FindAsync(id);
        if (clientemodel != null)
        {
            _context.ClienteModel.Remove(clientemodel);
        }

        await _context.SaveChangesAsync();
        return RedirectToAction(nameof(Index));
    }

    private bool ClienteModelExists(int? id)
    {
        return _context.ClienteModel.Any(e => e.Id == id);
    }
}
