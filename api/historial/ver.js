const mysql = require("mysql2/promise");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  let connection;
  try {
    connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

    const [rows] = await connection.execute(
      `SELECT ciudad, latitud, longitud, humedad, 
       DATE_FORMAT(created_at,'%m/%d/%Y %H:%i %p') AS created_at 
       FROM historial ORDER BY id DESC`
    );

    res.status(200).json(rows);
  } catch (error) {
    console.error("Error en historial/ver:", error);
    res.status(500).json({ error: "Error al obtener el historial" });
  } finally {
    if (connection) await connection.end();
  }
};
