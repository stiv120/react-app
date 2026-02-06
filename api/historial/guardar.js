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

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });

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
    res.status(200).json(response);
  } catch (error) {
    console.error("Error en historial/guardar:", error);
    response.message =
      error.message || "No se ha podido registrar en la base de datos.";
    res.status(500).json(response);
  }
};
