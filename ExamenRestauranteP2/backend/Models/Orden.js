const db = require("../db");

class Orden {
  // Crear orden
  static async create(ordenData) {
    const { cliente_id, articulos } = ordenData;
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();
      let o_total = 0;
      articulos.forEach((item) => {
        o_total += item.d_cantidad * item.d_precio_unitario;
      });

      const [ordenResult] = await connection.query(
        "INSERT INTO Ordenes (cliente_id, o_total) VALUES (?, ?)",
        [cliente_id, o_total],
      );
      const orden_id = ordenResult.insertId;

      for (const item of articulos) {
        await connection.query(
          "INSERT INTO Detalles_Ordenes (orden_id, menu_id, d_cantidad, d_precio_unitario) VALUES (?, ?, ?, ?)",
          [orden_id, item.menu_id, item.d_cantidad, item.d_precio_unitario],
        );
      }

      await connection.commit();
      return orden_id;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  // Obtener todas las órdenes
  static async getAll() {
    const [ordenes] = await db.query(`
            SELECT o.*, c.c_nombre, c.c_apellido 
            FROM Ordenes o
            LEFT JOIN Clientes c ON o.cliente_id = c.cliente_id
            ORDER BY o.o_fecha_orden DESC
        `);

    for (let orden of ordenes) {
      const [detalles] = await db.query(
        `
                SELECT d.*, m.m_nombre 
                FROM Detalles_Ordenes d
                JOIN Menus m ON d.menu_id = m.menu_id
                WHERE d.orden_id = ?
            `,
        [orden.orden_id],
      );

      orden.articulos = detalles;
    }

    return ordenes;
  }

  // Cambiar estado
  static async updateEstado(id, nuevoEstado) {
    const [result] = await db.query(
      "UPDATE Ordenes SET o_estado = ? WHERE orden_id = ?",
      [nuevoEstado, id],
    );
    return result.affectedRows > 0;
  }
}

module.exports = Orden;
