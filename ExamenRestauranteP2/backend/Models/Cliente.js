const db = require("../db");

class Cliente {
  // Obtener todos los clientes
  static async getAll() {
    const [rows] = await db.query(
      "SELECT * FROM Clientes WHERE c_disponible = true",
    );
    return rows;
  }

  // Obtener un cliente
  static async getById(id) {
    const [rows] = await db.query(
      "SELECT * FROM Clientes WHERE cliente_id = ?",
      [id],
    );
    return rows[0];
  }

  // Registrar cliente
  static async create(clienteData) {
    const { c_nombre, c_apellido, c_email, c_telefono } = clienteData;

    const [existente] = await db.query(
      "SELECT cliente_id FROM Clientes WHERE c_email = ? AND c_disponible = true",
      [c_email],
    );

    if (existente.length > 0) {
      throw new Error(
        "Ya existe un cliente activo registrado con este correo electrónico",
      );
    }

    const [result] = await db.query(
      "INSERT INTO Clientes (c_nombre, c_apellido, c_email, c_telefono) VALUES (?, ?, ?, ?)",
      [c_nombre, c_apellido, c_email, c_telefono],
    );
    return result.insertId;
  }

  // Actualizar un cliente
  static async update(id, clienteData) {
    const { c_nombre, c_apellido, c_email, c_telefono, c_disponible } =
      clienteData;

    const [existente] = await db.query(
      "SELECT cliente_id FROM Clientes WHERE c_email = ? AND c_disponible = true AND cliente_id != ?",
      [c_email, id],
    );

    if (existente.length > 0) {
      throw new Error(
        "El correo electrónico ya está siendo utilizado por otro cliente activo",
      );
    }

    const disponibilidadFinal =
      c_disponible !== undefined && c_disponible !== null ? c_disponible : true;

    const [result] = await db.query(
      "UPDATE Clientes SET c_nombre = ?, c_apellido = ?, c_email = ?, c_telefono = ?, c_disponible = ? WHERE cliente_id = ?",
      [c_nombre, c_apellido, c_email, c_telefono, disponibilidadFinal, id],
    );
    return result.affectedRows > 0;
  }

  // Desactivar cliente
  static async delete(id) {
    const [result] = await db.query(
      "UPDATE Clientes SET c_disponible = false WHERE cliente_id = ?",
      [id],
    );
    return result.affectedRows > 0;
  }
}

module.exports = Cliente;
