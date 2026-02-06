const mysql = require("mysql2/promise");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  let response = { status: 0, message: "Error desconocido." };

  try {
    const historial =
      typeof req.body === "string" ? JSON.parse(req.body) : req.body;

    if (!historial) {
      response.message = "Datos JSON inválidos.";
      return res.status(400).json(response);
    }

    if (
      !historial.name ||
      !historial.coord?.lat ||
      !historial.coord?.lon ||
      historial.main?.humidity === undefined
    ) {
      response.message = "Datos incompletos.";
      return res.status(400).json(response);
    }

    const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = process.env;
    if (!DB_HOST || !DB_USER || !DB_NAME) {
      return res.status(503).json({
        error:
          "Base de datos no configurada. Añade DB_HOST, DB_USER, DB_PASS y DB_NAME en Vercel.",
      });
    }

    const port = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306;
    const connection = await mysql.createConnection({
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

    await connection.execute(
      "INSERT INTO historial (ciudad, latitud, longitud, humedad) VALUES (?, ?, ?, ?)",
      [
        historial.name,
        historial.coord.lat,
        historial.coord.lon,
        historial.main.humidity,
      ]
    );

    await connection.end();

    response = { status: 1, message: "Se ha guardado correctamente." };
    res.status(201).json(response);
  } catch (error) {
    console.error("Error en historial/guardar:", error);
    response.message =
      error.message || "No se ha podido registrar en la base de datos.";
    res.status(500).json(response);
  }
};
