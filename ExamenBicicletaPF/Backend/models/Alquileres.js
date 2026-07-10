const db = require("../db");

const Alquiler = {
  // OBTENER ALQUILERES
  obtenerTodos: async () => {
    try {
      const query = `
                SELECT a.*, c.c_nombres AS cliente_nombre, b.b_codigo AS bicicleta_codigo
                FROM Alquileres a
                INNER JOIN Clientes c ON a.cliente_id = c.cliente_id
                INNER JOIN Bicicletas b ON a.bicicleta_id = b.bicicleta_id
                ORDER BY a.a_inicio DESC
            `;
      const [rows] = await db.execute(query);
      return rows;
    } catch (error) {
      throw new Error(
        "Error al obtener el historial de alquileres: " + error.message,
      );
    }
  },

  // REGISTRAR UN ALQUILER
  comenzar: async (cliente_id, bicicleta_id) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const [bici] = await connection.execute(
        "SELECT b_estado, b_disponible FROM Bicicletas WHERE bicicleta_id = ?",
        [bicicleta_id],
      );

      if (
        !bici[0] ||
        !bici[0].b_disponible ||
        bici[0].b_estado !== "en_estacion"
      ) {
        throw new Error("La bicicleta no está disponible para alquiler.");
      }

      const queryAlquiler = `
                INSERT INTO Alquileres (cliente_id, bicicleta_id) 
                VALUES (?, ?)
            `;
      const [resultAlquiler] = await connection.execute(queryAlquiler, [
        cliente_id,
        bicicleta_id,
      ]);

      const queryBici = `
                UPDATE Bicicletas 
                SET b_estado = 'prestada', estacion_id = NULL 
                WHERE bicicleta_id = ?
            `;
      await connection.execute(queryBici, [bicicleta_id]);

      await connection.commit();

      return {
        alquiler_id: resultAlquiler.insertId,
        cliente_id,
        bicicleta_id,
        mensaje: "Alquiler iniciado correctamente.",
      };
    } catch (error) {
      await connection.rollback();
      throw new Error("Error al iniciar el alquiler: " + error.message);
    } finally {
      connection.release();
    }
  },

  // FINALIZAR UN ALQUILER
  terminar: async (alquiler_id, nueva_estacion_id) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const [alquiler] = await connection.execute(
        "SELECT bicicleta_id, a_fin FROM Alquileres WHERE alquiler_id = ?",
        [alquiler_id],
      );

      if (!alquiler[0]) {
        throw new Error("El registro de alquiler no existe.");
      }
      if (alquiler[0].a_fin !== null) {
        throw new Error("Este alquiler ya fue cerrado previamente.");
      }

      const bicicleta_id = alquiler[0].bicicleta_id;

      const queryAlquiler = `
                UPDATE Alquileres 
                SET a_fin = NOW() 
                WHERE alquiler_id = ?
            `;
      await connection.execute(queryAlquiler, [alquiler_id]);

      const queryBici = `
                UPDATE Bicicletas 
                SET b_estado = 'en_estacion', estacion_id = ? 
                WHERE bicicleta_id = ?
            `;
      await connection.execute(queryBici, [nueva_estacion_id, bicicleta_id]);

      await connection.commit();
      return {
        alquiler_id,
        mensaje: "Bicicleta devuelta y reasignada con éxito.",
      };
    } catch (error) {
      await connection.rollback();
      throw new Error("Error al procesar la devolución: " + error.message);
    } finally {
      connection.release();
    }
  },
};

module.exports = Alquiler;
