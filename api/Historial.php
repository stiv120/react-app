<?php

class Historial {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function insertHistorial() {
        $response = ['status' => 0, 'message' => 'Error desconocido.'];

        // Obtenemos y decodificamos el JSON
        $historialJson = file_get_contents('php://input');
        $historial = json_decode($historialJson);

        // Verificamos si la decodificación fue exitosa
        if ($historial === null) {
            $response['message'] = 'Datos JSON inválidos.';
            echo json_encode($response);
            return false;
        }

        // Verificamos si los datos necesarios están presentes
        if (isset($historial->name, $historial->coord->lat, $historial->coord->lon, $historial->main->humidity)) {
            // Preparamos la consulta SQL
            $sql = "INSERT INTO historial (ciudad, latitud, longitud, humedad) VALUES (:ciudad, :latitud, :longitud, :humedad)";
            $stmt = $this->conn->prepare($sql);

            // Vinculamos los parámetros
            $stmt->bindParam(':ciudad', $historial->name);
            $stmt->bindParam(':latitud', $historial->coord->lat);
            $stmt->bindParam(':longitud', $historial->coord->lon);
            $stmt->bindParam(':humedad', $historial->main->humidity);

            if ($stmt->execute()) {
                $response = ['status' => 1, 'message' => 'Se ha guardado correctamente.'];
            } else {
                $response['message'] = 'No se ha podido registrar en la base de datos.';
            }
        } else {
            $response['message'] = 'Datos incompletos.';
        }

        echo json_encode($response);
        return $this->conn->lastInsertId();
    }

    public function getAllHistorial() {
        // Consultamos todos los datos del historial
        $query = "SELECT ciudad, latitud, longitud, humedad, DATE_FORMAT(created_at,'%m/%d/%Y %H:%i %p') AS created_at FROM historial ORDER BY id DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
