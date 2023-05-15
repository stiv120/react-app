<?php

class Historial {
    private $conn;

    public function __construct($conn) {
        $this->conn = $conn;
    }

    public function insertHistorial() {
        $historial = json_decode(file_get_contents('php://input'));
        $sql = "INSERT INTO historial (ciudad, latitud, longitud, humedad) VALUES (:ciudad, :latitud, :longitud, :humedad)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bindParam(':ciudad', $historial->name);
        $stmt->bindParam(':latitud', $historial->coord->lat);
        $stmt->bindParam(':longitud', $historial->coord->lon);
        $stmt->bindParam(':humedad', $historial->main->humidity);

        if ($stmt->execute()) {
            $response = ['status' => 1, 'message' => 'Se ha guardado correctamente.'];
        } else {
            $response = ['status' => 0, 'message' => 'No se ha podido registrar en la base de datos.'];
        }

        echo json_encode($response);
        return $this->conn->lastInsertId();
    }

    public function getAllHistorial() {
        $query = "SELECT ciudad, latitud, longitud, humedad, DATE_FORMAT(created_at,'%m/%d/%Y %H:%i %p') AS created_at FROM historial ORDER BY id DESC";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}
