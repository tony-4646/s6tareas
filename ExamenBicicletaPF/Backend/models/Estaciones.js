const db = require("../db"); // Importa tu promisePool

const Estacion = {
  // OBTENER ESTACIONES DISPONIBLES
  obtenerTodas: async () => {
    try {
      const [rows] = await db.execute(
        "SELECT * FROM Estaciones WHERE e_disponible = TRUE",
      );
      return rows;
    } catch (error) {
      throw new Error("Error al obtener las estaciones: " + error.message);
    }
  },

  // OBTENER UNA ESTACIÓN
  obtenerPorId: async (id) => {
    try {
      const [rows] = await db.execute(
        "SELECT * FROM Estaciones WHERE estacion_id = ?",
        [id],
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error("Error al buscar la estación: " + error.message);
    }
  },

  // NUEVA ESTACIÓN
  crear: async (datosEstacion) => {
    const { e_nombre, e_direccion, e_capacidad, e_ciudad } = datosEstacion;
    try {
      const query = `
                INSERT INTO Estaciones (e_nombre, e_direccion, e_capacidad, e_ciudad) 
                VALUES (?, ?, ?, ?)
            `;
      const [result] = await db.execute(query, [
        e_nombre,
        e_direccion,
        e_capacidad,
        e_ciudad,
      ]);
      return { estacion_id: result.insertId, ...datosEstacion };
    } catch (error) {
      throw new Error("Error al crear la estación: " + error.message);
    }
  },

  // ACTUALIZAR ESTACIÓN
  actualizar: async (id, datosActualizados) => {
    const { e_nombre, e_direccion, e_capacidad, e_ciudad } = datosActualizados;
    try {
      const query = `
                UPDATE Estaciones 
                SET e_nombre = ?, e_direccion = ?, e_capacidad = ?, e_ciudad = ? 
                WHERE estacion_id = ?
            `;
      const [result] = await db.execute(query, [
        e_nombre,
        e_direccion,
        e_capacidad,
        e_ciudad,
        id,
      ]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error("Error al actualizar la estación: " + error.message);
    }
  },

  // DESACTIVAR ESTACIÓN
  desactivar: async (id) => {
    try {
      const query =
        "UPDATE Estaciones SET e_disponible = FALSE WHERE estacion_id = ?";
      const [result] = await db.execute(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error("Error al desactivar la estación: " + error.message);
    }
  },
};

module.exports = Estacion;
