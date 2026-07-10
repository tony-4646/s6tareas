const db = require("../db");

const Cliente = {
  // TODOS LOS CLIENTES DISPONIBLES
  obtenerTodos: async () => {
    try {
      const [rows] = await db.execute(
        "SELECT * FROM Clientes WHERE c_disponible = TRUE",
      );
      return rows;
    } catch (error) {
      throw new Error("Error al obtener los clientes: " + error.message);
    }
  },

  // CLIENTE POR ID
  obtenerPorId: async (id) => {
    try {
      const [rows] = await db.execute(
        "SELECT * FROM Clientes WHERE cliente_id = ?",
        [id],
      );
      return rows[0] || null;
    } catch (error) {
      throw new Error("Error al buscar el cliente: " + error.message);
    }
  },

  // NUEVO CLIENTE
  crear: async (datosCliente) => {
    const { c_nombres, c_documento, c_telefono, c_email } = datosCliente;
    try {
      const query = `
                INSERT INTO Clientes (c_nombres, c_documento, c_telefono, c_email) 
                VALUES (?, ?, ?, ?)
            `;
      const [result] = await db.execute(query, [
        c_nombres,
        c_documento,
        c_telefono,
        c_email,
      ]);
      return { cliente_id: result.insertId, ...datosCliente };
    } catch (error) {
      throw new Error("Error al crear el cliente: " + error.message);
    }
  },

  // ACTUALIZAR
  actualizar: async (id, datosActualizados) => {
    const { c_nombres, c_documento, c_telefono, c_email } = datosActualizados;
    try {
      const query = `
                UPDATE Clientes 
                SET c_nombres = ?, c_documento = ?, c_telefono = ?, c_email = ? 
                WHERE cliente_id = ?
            `;
      const [result] = await db.execute(query, [
        c_nombres,
        c_documento,
        c_telefono,
        c_email,
        id,
      ]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error("Error al actualizar el cliente: " + error.message);
    }
  },

  // DESACTIVAR
  desactivar: async (id) => {
    try {
      const query =
        "UPDATE Clientes SET c_disponible = FALSE WHERE cliente_id = ?";
      const [result] = await db.execute(query, [id]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error("Error al desactivar el cliente: " + error.message);
    }
  },
};

module.exports = Cliente;
