const express = require("express");
const cors = require("cors");
const Cliente = require("./models/Clientes");
const Estacion = require("./models/Estaciones");
const Bicicleta = require("./models/Bicicletas");
const Alquiler = require("./models/Alquileres");
const db = require("./db");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ mensaje: "API de Sistema de Alquiler de Bicicletas Operativa" });
});

// CLIENTES -----------------------------------------------------------------------------------------
app.get("/api/clientes", async (req, res) => {
  try {
    const clientes = await Cliente.obtenerTodos();
    res.json(clientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/clientes", async (req, res) => {
  try {
    const nuevoCliente = await Cliente.crear(req.body);
    res.status(201).json(nuevoCliente);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/clientes/:id", async (req, res) => {
  try {
    const actualizado = await Cliente.actualizar(req.params.id, req.body);
    if (actualizado)
      res.json({ mensaje: "Cliente actualizado correctamente." });
    else res.status(404).json({ error: "Cliente no encontrado." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/clientes/:id", async (req, res) => {
  try {
    const desactivado = await Cliente.desactivar(req.params.id);
    if (desactivado)
      res.json({ mensaje: "Cliente deshabilitado correctamente." });
    else res.status(404).json({ error: "Cliente no encontrado." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ESTACIONES ----------------------------------------------------------------------------------------
app.get("/api/estaciones", async (req, res) => {
  try {
    const estaciones = await Estacion.obtenerTodas();
    res.json(estaciones);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/estaciones/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const actualizado = await Estacion.actualizar(id, req.body);

    if (actualizado) {
      res.json({ mensaje: "Estación actualizada correctamente." });
    } else {
      res
        .status(404)
        .json({ error: "La estación solicitada no fue encontrada." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/estaciones/:id", async (req, res) => {
  const { id } = req.params;
  const { e_capacidad } = req.body;

  try {
    const [rowsBicis] = await db.execute(
      "SELECT COUNT(*) AS total FROM Bicicletas WHERE estacion_id = ? AND b_estado = 'en_estacion'",
      [id],
    );
    const bicisEnPunto = rowsBicis[0].total;

    if (e_capacidad < bicisEnPunto) {
      return res.status(400).json({
        error: `No se puede reducir la capacidad a ${e_capacidad}. La estación actualmente resguarda ${bicisEnPunto} bicicletas.`,
      });
    }
    const actualizado = await Estacion.actualizar(id, req.body);
    if (actualizado) {
      res.json({ mensaje: "Estación actualizada correctamente." });
    } else {
      res
        .status(404)
        .json({ error: "La estación solicitada no fue encontrada." });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/estaciones/:id", async (req, res) => {
  const estacion_origen_id = req.params.id;
  const { estacion_destino_id } = req.body;

  if (!estacion_destino_id) {
    return res.status(400).json({
      error:
        "Debe especificar una estación de destino para reasignar las bicicletas activas.",
    });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [destinoRows] = await connection.execute(
      "SELECT e_nombre, e_capacidad FROM Estaciones WHERE estacion_id = ? AND e_disponible = TRUE",
      [estacion_destino_id],
    );

    if (destinoRows.length === 0) {
      await connection.rollback();
      return res
        .status(404)
        .json({ error: "La estación de destino no existe o está inactiva." });
    }
    const destino = destinoRows[0];

    const [origenBicisRows] = await connection.execute(
      "SELECT COUNT(*) AS total FROM Bicicletas WHERE estacion_id = ? AND b_estado = 'en_estacion'",
      [estacion_origen_id],
    );
    const bicisA_Transferir = origenBicisRows[0].total;

    const [destinoBicisRows] = await connection.execute(
      "SELECT COUNT(*) AS total FROM Bicicletas WHERE estacion_id = ? AND b_estado = 'en_estacion'",
      [estacion_destino_id],
    );
    const bicisActualesDestino = destinoBicisRows[0].total;

    const slotsDisponiblesDestino = destino.e_capacidad - bicisActualesDestino;

    if (bicisA_Transferir > slotsDisponiblesDestino) {
      await connection.rollback();
      return res.status(400).json({
        error: `Capacidad insuficiente en ${destino.e_nombre}. Intentas transferir ${bicisA_Transferir} bicicletas, pero solo quedan ${slotsDisponiblesDestino} espacios de los ${destino.e_capacidad} totales.`,
      });
    }

    await Bicicleta.reasignarPorEstacionDeshabilitada(
      estacion_origen_id,
      estacion_destino_id,
      connection,
    );

    const queryDesactivar =
      "UPDATE Estaciones SET e_disponible = FALSE WHERE estacion_id = ?";
    const [resultDesactivar] = await connection.execute(queryDesactivar, [
      estacion_origen_id,
    ]);

    if (resultDesactivar.affectedRows > 0) {
      await connection.commit();
      res.json({
        mensaje:
          "Bicicletas reasignadas y estación puesta fuera de servicio con éxito.",
      });
    } else {
      await connection.rollback();
      res.status(404).json({ error: "Estación de origen no encontrada." });
    }
  } catch (error) {
    await connection.rollback();
    const esErrorValidacion = error.message.includes("Capacidad insuficiente");
    res.status(esErrorValidacion ? 400 : 500).json({ error: error.message });
  } finally {
    connection.release();
  }
});

// BICICLETAS -----------------------------------------------------------------------------------------
app.get("/api/bicicletas", async (req, res) => {
  try {
    const bicicletas = await Bicicleta.obtenerTodas();
    res.json(bicicletas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/bicicletas", async (req, res) => {
  try {
    const nuevaBici = await Bicicleta.crear(req.body);
    res.status(201).json(nuevaBici);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete("/api/bicicletas/:id", async (req, res) => {
  try {
    const desactivada = await Bicicleta.desactivar(req.params.id);
    if (desactivada)
      res.json({ mensaje: "Bicicleta dada de baja del sistema." });
    else res.status(404).json({ error: "Bicicleta no encontrada." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ALQUILERES ----------------------------------------------------------------------------------------
app.get("/api/alquileres", async (req, res) => {
  try {
    const historial = await Alquiler.obtenerTodos();
    res.json(historial);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/alquileres/comenzar", async (req, res) => {
  const { cliente_id, bicicleta_id } = req.body;
  if (!cliente_id || !bicicleta_id) {
    return res
      .status(400)
      .json({
        error: "Faltan parámetros requeridos (cliente_id, bicicleta_id)",
      });
  }
  try {
    const resultado = await Alquiler.comenzar(cliente_id, bicicleta_id);
    res.status(201).json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.put("/api/alquileres/terminar/:id", async (req, res) => {
  const { nueva_estacion_id } = req.body;
  if (!nueva_estacion_id) {
    return res
      .status(400)
      .json({
        error:
          "Debe especificar la nueva_estacion_id donde se devuelve la bicicleta",
      });
  }
  try {
    const resultado = await Alquiler.terminar(req.params.id, nueva_estacion_id);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/alquileres", async (req, res) => {
  const { cliente_id, bicicleta_id } = req.body;

  if (!cliente_id || !bicicleta_id) {
    return res
      .status(400)
      .json({ error: "Faltan datos obligatorios para procesar el alquiler." });
  }

  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const [alquileresActivosRows] = await connection.execute(
      "SELECT COUNT(*) AS activos FROM alquileres WHERE cliente_id = ? AND a_fin IS NULL",
      [cliente_id],
    );
    const totalActivos = alquileresActivosRows[0].activos;

    if (totalActivos >= 3) {
      await connection.rollback();
      return res.status(400).json({
        error: `Límite de alquileres excedido. El cliente ya cuenta con ${totalActivos} bicicletas en uso. Debe devolver al menos una antes de retirar otra.`,
      });
    }

    const [biciRows] = await connection.execute(
      "SELECT b_estado, b_disponible FROM bicicletas WHERE bicicleta_id = ?",
      [bicicleta_id],
    );

    if (biciRows.length === 0) {
      await connection.rollback();
      return res
        .status(404)
        .json({ error: "La bicicleta seleccionada no existe." });
    }

    const bici = biciRows[0];
    if (bici.b_estado !== "en_estacion" || bici.b_disponible === 0) {
      await connection.rollback();
      return res
        .status(400)
        .json({
          error:
            "La bicicleta seleccionada no se encuentra disponible en estación.",
        });
    }

    const queryAlquiler =
      "INSERT INTO alquileres (cliente_id, bicicleta_id, a_inicio, a_fin) VALUES (?, ?, NOW(), NULL)";
    await connection.execute(queryAlquiler, [cliente_id, bicicleta_id]);

    const queryBici =
      "UPDATE bicicletas SET b_estado = 'prestada' WHERE bicicleta_id = ?";
    await connection.execute(queryBici, [bicicleta_id]);

    await connection.commit();
    res.status(201).json({ mensaje: "¡Alquiler despachado con éxito!" });
  } catch (error) {
    await connection.rollback();
    res
      .status(500)
      .json({
        error: "Error interno en el servidor al despachar: " + error.message,
      });
  } finally {
    connection.release();
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo exitosamente en http://localhost:${PORT}`);
});
