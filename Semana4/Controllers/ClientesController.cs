
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Semana4.Models;
using Semana4.Data;

public class ClientesController : Controller
{
    private readonly ApplicationDbContext _context;

    public ClientesController(ApplicationDbContext context)
    {
        _context = context;
    }

    // GET: CLIENTES
    public async Task<IActionResult> Index()    
    {
        return View(await _context.Clientes.ToListAsync());
    }

    // GET: CLIENTES/Details/5
    public async Task<IActionResult> Details(int? cli_id)
    {
        if (cli_id == null)
        {
            return NotFound();
        }

        var cliente = await _context.Clientes
            .FirstOrDefaultAsync(m => m.Cli_Id == cli_id);
        if (cliente == null)
        {
            return NotFound();
        }

        return View(cliente);
    }

    // GET: CLIENTES/Create
    public IActionResult Create()
    {
        return View();
    }

    // POST: CLIENTES/Create
    // To protect from overposting attacks, enable the specific properties you want to bind to.
    // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Create([Bind("Cli_Id,Cli_Nombre,Cli_Cedula,Cli_Telefono,Cli_Direccion,Cli_Registro")] Cliente cliente)
    {
        var existe = await _context.Clientes.AnyAsync(c => c.Cli_Cedula == cliente.Cli_Cedula);
        if (existe)
        {
            ModelState.AddModelError("Cli_Cedula", "El cliente ya existe.");
            return View(cliente);
        }

        if (ModelState.IsValid)
        {
            _context.Add(cliente);
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }
        return View(cliente);
    }

    // GET: CLIENTES/Edit/5
    public async Task<IActionResult> Edit(int? cli_id)
    {
        if (cli_id == null)
        {
            return NotFound();
        }

        var cliente = await _context.Clientes.FindAsync(cli_id);
        if (cliente == null)
        {
            return NotFound();
        }
        return View(cliente);
    }

    // POST: CLIENTES/Edit/5
    // To protect from overposting attacks, enable the specific properties you want to bind to.
    // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
    [HttpPost]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> Edit(int? cli_id, [Bind("Cli_Id,Cli_Nombre,Cli_Cedula,Cli_Telefono,Cli_Direccion,Cli_Registro")] Cliente cliente)
    {
        if (cli_id != cliente.Cli_Id)
        {
            return NotFound();
        }

        var existe = await _context.Clientes.AnyAsync(c => c.Cli_Cedula == cliente.Cli_Cedula && c.Cli_Id != cliente.Cli_Id);
        if (existe)
        {
            ModelState.AddModelError("Cli_Cedula", "El cliente ya existe.");
            return View(cliente);
        }

        if (ModelState.IsValid)
        {
            try
            {
                _context.Update(cliente);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ClienteExists(cliente.Cli_Id))
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
        return View(cliente);
    }

    // GET: CLIENTES/Delete/5
    public async Task<IActionResult> Delete(int? cli_id)
    {
        if (cli_id == null)
        {
            return NotFound();
        }

        var cliente = await _context.Clientes
            .FirstOrDefaultAsync(m => m.Cli_Id == cli_id);
        if (cliente == null)
        {
            return NotFound();
        }

        return View(cliente);
    }

    // POST: CLIENTES/Delete/5
    [HttpPost, ActionName("Delete")]
    [ValidateAntiForgeryToken]
    public async Task<IActionResult> DeleteConfirmed(int? cli_id)
    {
        var cliente = await _context.Clientes.FindAsync(cli_id);
        if (cliente != null)
        {
            _context.Clientes.Remove(cliente);
        }

        await _context.SaveChangesAsync();
        return RedirectToAction(nameof(Index));
    }

    private bool ClienteExists(int? cli_id)
    {
        return _context.Clientes.Any(e => e.Cli_Id == cli_id);
    }
}
