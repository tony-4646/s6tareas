const db = require("../db");

class Menu {
  // Obtener todos los platos
  static async getAll() {
    const [rows] = await db.query(
      "SELECT * FROM Menus WHERE m_disponible = true",
    );
    return rows;
  }

  // Obtener solo un plato
  static async getById(id) {
    const [rows] = await db.query("SELECT * FROM Menus WHERE menu_id = ?", [
      id,
    ]);
    return rows[0];
  }

  // Nuevo plato
  static async create(menuData) {
    const { m_nombre, m_descripcion, m_precio } = menuData;

    const [existente] = await db.query(
      "SELECT menu_id FROM Menus WHERE m_nombre = ? AND m_disponible = true",
      [m_nombre],
    );

    if (existente.length > 0) {
      throw new Error("Ya existe un plato activo con este nombre.");
    }

    const [result] = await db.query(
      "INSERT INTO Menus (m_nombre, m_descripcion, m_precio) VALUES (?, ?, ?)",
      [m_nombre, m_descripcion, m_precio],
    );
    return result.insertId;
  }

  // Actualizar plato
  static async update(id, menuData) {
    const { m_nombre, m_descripcion, m_precio, m_disponible } = menuData;

    const [existente] = await db.query(
      "SELECT menu_id FROM Menus WHERE m_nombre = ? AND m_disponible = true AND menu_id != ?",
      [m_nombre, id],
    );
    if (existente.length > 0) {
      throw new Error("Ya existe otro plato activo con este nombre");
    }

    const disponibilidadFinal =
      m_disponible !== undefined && m_disponible !== null ? m_disponible : true;

    const [result] = await db.query(
      "UPDATE Menus SET m_nombre = ?, m_descripcion = ?, m_precio = ?, m_disponible = ? WHERE menu_id = ?",
      [m_nombre, m_descripcion, m_precio, disponibilidadFinal, id],
    );
    return result.affectedRows > 0;
  }

  // eliminar plato
  static async delete(id) {
    const [result] = await db.query(
      "UPDATE Menus SET m_disponible = false WHERE menu_id = ?",
      [id],
    );
    return result.affectedRows > 0;
  }
}

module.exports = Menu;
