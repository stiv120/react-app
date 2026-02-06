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

  const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env;
  if (!DB_HOST || !DB_USER || !DB_NAME) {
    return res.status(503).json({
      error:
        "Base de datos no configurada. Añade DB_HOST, DB_USER, DB_PASS y DB_NAME en Vercel.",
    });
  }

  const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;
  let connection;
  try {
    connection = await mysql.createConnection({
      host: DB_HOST,
      port,
      user: DB_USER,
      password: DB_PASS,
      database: DB_NAME,
      ssl:
        process.env.DB_SSL === "false"
          ? undefined
          : { rejectUnauthorized: true },
    });

    await connection.execute(
      `CREATE TABLE IF NOT EXISTS historial (
        id INT NOT NULL AUTO_INCREMENT,
        ciudad VARCHAR(250) NOT NULL,
        latitud FLOAT NOT NULL,
        longitud FLOAT NOT NULL,
        humedad FLOAT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
      )`
    );

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
