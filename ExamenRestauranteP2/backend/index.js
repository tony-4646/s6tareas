const express = require("express");
const cors = require("cors");
const Menu = require("./models/Menu");
const Cliente = require("./models/Cliente");
const Orden = require("./models/Orden");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// ENDPOINTS MENÚ ------------------------------------------------------------------------------
// Obtener todos los menús
app.get("/menus", async (req, res) => {
  try {
    const menus = await Menu.getAll();
    res.json(menus);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los menús" });
  }
});
// Obtener uno por ID
app.get("/menus/:id", async (req, res) => {
  try {
    const menu = await Menu.getById(req.params.id);
    if (!menu) return res.status(404).json({ error: "Menú no encontrado" });
    res.json(menu);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el menú" });
  }
});
// Crear un platillo
app.post("/menus", async (req, res) => {
  try {
    const nuevoId = await Menu.create(req.body);
    res
      .status(201)
      .json({ mensaje: "Menú creado con éxito", menu_id: nuevoId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// Editar un platillo
app.put("/menus/:id", async (req, res) => {
  try {
    const actualizado = await Menu.update(req.params.id, req.body);
    if (!actualizado)
      return res
        .status(404)
        .json({ error: "Menú no encontrado para actualizar" });
    res.json({ mensaje: "Menú actualizado con éxito" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
// Eliminar un platillo
app.delete("/menus/:id", async (req, res) => {
  try {
    const eliminado = await Menu.delete(req.params.id);
    if (!eliminado)
      return res
        .status(404)
        .json({ error: "Menú no encontrado para eliminar" });
    res.json({ mensaje: "Menú eliminado correctamente" });
  } catch (error) {
    res
      .status(500)
      .json({
        error:
          "No se pudo eliminar el menú (podría estar asociado a una orden)",
      });
  }
});

// ENDPOINTS CLIENTES ------------------------------------------------------------------------------
// Obtener clientes activos
app.get("/clientes", async (req, res) => {
  try {
    const clientes = await Cliente.getAll();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los clientes" });
  }
});
// Obtener solo un cliente activo
app.get("/clientes/:id", async (req, res) => {
  try {
    const cliente = await Cliente.getById(req.params.id);
    if (!cliente)
      return res.status(404).json({ error: "Cliente no encontrado" });
    res.json(cliente);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el cliente" });
  }
});
// Registrar nuevo cliente
app.post("/clientes", async (req, res) => {
  try {
    const nuevoId = await Cliente.create(req.body);
    res
      .status(201)
      .json({ mensaje: "Cliente registrado con éxito", cliente_id: nuevoId });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Editar nuevo cliente
app.put("/clientes/:id", async (req, res) => {
  try {
    const actualizado = await Cliente.update(req.params.id, req.body);
    if (!actualizado)
      return res
        .status(404)
        .json({ error: "Cliente no encontrado para actualizar" });
    res.json({ mensaje: "Cliente actualizado con éxito" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Desactivar un cliente
app.delete("/clientes/:id", async (req, res) => {
  try {
    const eliminado = await Cliente.delete(req.params.id);
    if (!eliminado)
      return res.status(404).json({ error: "Cliente no encontrado" });
    res.json({ mensaje: "Cliente desactivado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al desactivar el cliente" });
  }
});

// ENDPOINTS ORDENES ------------------------------------------------------------------------------
// Obtener el historial de órdenes
app.get("/ordenes", async (req, res) => {
  try {
    const ordenes = await Orden.getAll();
    res.json(ordenes);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las órdenes" });
  }
});
// Crear una órden completa
app.post("/ordenes", async (req, res) => {
  try {
    const nuevaOrdenId = await Orden.create(req.body);
    res.status(201).json({
      mensaje: "¡Orden procesada y enviada a la cocina!",
      orden_id: nuevaOrdenId,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
});
// Actualizar un estado de órden
app.patch("/ordenes/:id/estado", async (req, res) => {
  try {
    const { o_estado } = req.body;
    const actualizado = await Orden.updateEstado(req.params.id, o_estado);
    if (!actualizado)
      return res.status(404).json({ error: "Orden no encontrada" });
    res.json({ mensaje: `Estado de la orden actualizado a: ${o_estado}` });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al actualizar el estado de la orden" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
