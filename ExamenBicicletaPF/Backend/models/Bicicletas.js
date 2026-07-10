const db = require('../db');

const Bicicleta = {
    // TODAS LAS BICICLETAS
    obtenerTodas: async () => {
        try {
            const query = `
                SELECT b.*, e.e_nombre AS estacion_nombre 
                FROM Bicicletas b
                LEFT JOIN Estaciones e ON b.estacion_id = e.estacion_id
                WHERE b.b_disponible = TRUE
            `;
            const [rows] = await db.execute(query);
            return rows;
        } catch (error) {
            throw new Error('Error al obtener las bicicletas: ' + error.message);
        }
    },

    // OBTENER UNA BICICLETA
    obtenerPorId: async (id) => {
        try {
            const query = `
                SELECT b.*, e.e_nombre AS estacion_nombre 
                FROM Bicicletas b
                LEFT JOIN Estaciones e ON b.estacion_id = e.estacion_id
                WHERE b.bicicleta_id = ? AND b.b_disponible = TRUE
            `;
            const [rows] = await db.execute(query, [id]);
            return rows[0] || null;
        } catch (error) {
            throw new Error('Error al buscar la bicicleta: ' + error.message);
        }
    },

    // REGISTRAR NUEVA BICICLETA
    crear: async (datosBicicleta) => {
        const { b_codigo, b_tipo, b_estado, estacion_id } = datosBicicleta;
        try {
            const query = `
                INSERT INTO Bicicletas (b_codigo, b_tipo, b_estado, estacion_id) 
                VALUES (?, ?, ?, ?)
            `;
            const [result] = await db.execute(query, [
                b_codigo, 
                b_tipo, 
                b_estado || 'en_estacion', 
                estacion_id || null
            ]);
            return { bicicleta_id: result.insertId, ...datosBicicleta, b_disponible: true };
        } catch (error) {
            throw new Error('Error al crear la bicicleta: ' + error.message);
        }
    },

    // REASIGNAR BICICLETAS SI SE DA DE BAJA UNA ESTACIÓN
    reasignarPorEstacionDeshabilitada: async (estacionOrigenId, estacionDestinoId) => {
        try {
            const query = `
                UPDATE Bicicletas 
                SET estacion_id = ? 
                WHERE estacion_id = ? AND b_estado = 'en_estacion' AND b_disponible = TRUE
            `;
            const [result] = await db.execute(query, [estacionDestinoId, estacionOrigenId]);
            return result.affectedRows;
        } catch (error) {
            throw new Error('Error al reasignar bicicletas: ' + error.message);
        }
    },

    // DESACTIVAR BICICLETA
    desactivar: async (id) => {
        try {
            const query = 'UPDATE Bicicletas SET b_disponible = FALSE, estacion_id = NULL WHERE bicicleta_id = ?';
            const [result] = await db.execute(query, [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error('Error al desactivar la bicicleta: ' + error.message);
        }
    }
};

module.exports = Bicicleta;