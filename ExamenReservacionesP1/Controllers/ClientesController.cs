
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ExamenReservacionesP1.Models;
using ExamenReservacionesP1.Data;

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
    public async Task<IActionResult> Details(int? cliente_id)
    {
        if (cliente_id == null)
        {
            return NotFound();
        }

        var clientesmodel = await _context.ClientesModel
            .FirstOrDefaultAsync(m => m.Cliente_Id == cliente_id);
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
    public async Task<IActionResult> Create([Bind("Cliente_Id,Cli_Nombre,Cli_Apellido,Cli_Email,Cli_Telefono")] ClientesModel clientesmodel)
    {
        bool emailExiste = await _context.ClientesModel.AnyAsync(c => c.Cli_Email == clientesmodel.Cli_Email);

        if (emailExiste)
        {
            ModelState.AddModelError(nameof(clientesmodel.Cli_Email), "El correo electrónico ya existe.");
        }

        if (ModelState.IsValid)
        {
            _context.Add(clientesmodel);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }
        return View(clientesmodel);
    }

    // GET: CLIENTESMODELS/Edit/5
    public async Task<IActionResult> Edit(int? cliente_id)
    {
        if (cliente_id == null)
        {
            return NotFound();
        }

        var clientesmodel = await _context.ClientesModel.FindAsync(cliente_id);
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
    public async Task<IActionResult> Edit(int? cliente_id, [Bind("Cliente_Id,Cli_Nombre,Cli_Apellido,Cli_Email,Cli_Telefono")] ClientesModel clientesmodel)
    {
        if (cliente_id != clientesmodel.Cliente_Id)
        {
            return NotFound();
        }

        bool emailExists = await _context.ClientesModel.AnyAsync(c => c.Cli_Email == clientesmodel.Cli_Email && c.Cliente_Id != cliente_id);
        if (emailExists)
        {
            ModelState.AddModelError(nameof(clientesmodel.Cli_Email), "El correo electrónico ya existe.");
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
                if (!ClientesModelExists(clientesmodel.Cliente_Id))
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
    public async Task<IActionResult> Delete(int? cliente_id)
    {
        if (cliente_id == null)
        {
            return NotFound();
        }

        var clientesmodel = await _context.ClientesModel
            .FirstOrDefaultAsync(m => m.Cliente_Id == cliente_id);
        if (clientesmodel == null)
        {
            return NotFound();
        }

        return View(clientesmodel);
    }

    // POST: CLIENTESMODELS/Delete/5
    [HttpPost, ActionName("Delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteConfirmed(int? cliente_id)
    {
        var clientesmodel = await _context.ClientesModel.FindAsync(cliente_id);
        if (clientesmodel != null)
        {
            _context.ClientesModel.Remove(clientesmodel);
        }

        await _context.SaveChangesAsync();
        return RedirectToAction(nameof(Index));
    }

    private bool ClientesModelExists(int? cliente_id)
    {
        return _context.ClientesModel.Any(e => e.Cliente_Id == cliente_id);
    }
}
